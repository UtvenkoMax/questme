//! QuestMe Data Parser — Fast JSON parsing and data transformation
//!
//! Handles bulk quest filtering, fuzzy search, and data aggregation
//! significantly faster than the JS thread for large datasets.

use serde::{Deserialize, Serialize};

// ─── Types ─────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuestData {
    pub id: String,
    pub title: String,
    pub description: String,
    pub category: String,
    pub difficulty: String,
    pub points: u32,
    pub completed: bool,
    pub rating: f64,
    pub participants: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FilterParams {
    pub category: Option<String>,
    pub difficulty: Option<String>,
    pub completed: Option<bool>,
    pub min_rating: Option<f64>,
    pub search_query: Option<String>,
    pub sort_by: Option<String>,
    pub limit: Option<usize>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AggregateStats {
    pub total_quests: usize,
    pub completed_count: usize,
    pub total_points: u32,
    pub average_rating: f64,
    pub categories: Vec<CategoryCount>,
    pub completion_rate: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CategoryCount {
    pub category: String,
    pub count: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchResult {
    pub id: String,
    pub title: String,
    pub score: f64,
}

// ─── Fuzzy Search ──────────────────────────────────────

/// Levenshtein distance between two strings.
fn levenshtein_distance(a: &str, b: &str) -> usize {
    let a_chars: Vec<char> = a.chars().collect();
    let b_chars: Vec<char> = b.chars().collect();
    let m = a_chars.len();
    let n = b_chars.len();

    let mut matrix = vec![vec![0usize; n + 1]; m + 1];

    for i in 0..=m {
        matrix[i][0] = i;
    }
    for j in 0..=n {
        matrix[0][j] = j;
    }

    for i in 1..=m {
        for j in 1..=n {
            let cost = if a_chars[i - 1].to_lowercase().eq(b_chars[j - 1].to_lowercase()) {
                0
            } else {
                1
            };
            matrix[i][j] = (matrix[i - 1][j] + 1)
                .min(matrix[i][j - 1] + 1)
                .min(matrix[i - 1][j - 1] + cost);
        }
    }

    matrix[m][n]
}

/// Calculate fuzzy match score (0.0 = no match, 1.0 = exact match).
fn fuzzy_score(query: &str, target: &str) -> f64 {
    let query_lower = query.to_lowercase();
    let target_lower = target.to_lowercase();

    // Exact substring match → high score
    if target_lower.contains(&query_lower) {
        return 0.9 + (query.len() as f64 / target.len() as f64) * 0.1;
    }

    // Levenshtein-based score
    let distance = levenshtein_distance(&query_lower, &target_lower);
    let max_len = query.len().max(target.len());
    if max_len == 0 {
        return 1.0;
    }

    1.0 - (distance as f64 / max_len as f64)
}

// ─── Core Functions ────────────────────────────────────

/// Filter and sort quests based on parameters.
pub fn filter_quests(quests: &[QuestData], params: &FilterParams) -> Vec<QuestData> {
    let mut result: Vec<QuestData> = quests
        .iter()
        .filter(|q| {
            if let Some(ref cat) = params.category {
                if q.category.to_lowercase() != cat.to_lowercase() {
                    return false;
                }
            }
            if let Some(ref diff) = params.difficulty {
                if q.difficulty != *diff {
                    return false;
                }
            }
            if let Some(completed) = params.completed {
                if q.completed != completed {
                    return false;
                }
            }
            if let Some(min_rating) = params.min_rating {
                if q.rating < min_rating {
                    return false;
                }
            }
            if let Some(ref query) = params.search_query {
                if !query.is_empty() {
                    let score = fuzzy_score(query, &q.title)
                        .max(fuzzy_score(query, &q.description));
                    if score < 0.3 {
                        return false;
                    }
                }
            }
            true
        })
        .cloned()
        .collect();

    // Sort
    match params.sort_by.as_deref() {
        Some("rating") => result.sort_by(|a, b| b.rating.partial_cmp(&a.rating).unwrap()),
        Some("points") => result.sort_by(|a, b| b.points.cmp(&a.points)),
        Some("participants") => result.sort_by(|a, b| b.participants.cmp(&a.participants)),
        Some("title") => result.sort_by(|a, b| a.title.cmp(&b.title)),
        _ => {}
    }

    if let Some(limit) = params.limit {
        result.truncate(limit);
    }

    result
}

/// Fuzzy search across quest titles and descriptions.
pub fn fuzzy_search(quests: &[QuestData], query: &str, limit: usize) -> Vec<SearchResult> {
    let mut results: Vec<SearchResult> = quests
        .iter()
        .map(|q| {
            let title_score = fuzzy_score(query, &q.title);
            let desc_score = fuzzy_score(query, &q.description) * 0.7;
            SearchResult {
                id: q.id.clone(),
                title: q.title.clone(),
                score: title_score.max(desc_score),
            }
        })
        .filter(|r| r.score > 0.25)
        .collect();

    results.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap());
    results.truncate(limit);
    results
}

/// Aggregate statistics from quest data.
pub fn aggregate_stats(quests: &[QuestData]) -> AggregateStats {
    let total = quests.len();
    let completed = quests.iter().filter(|q| q.completed).count();
    let total_points: u32 = quests.iter().filter(|q| q.completed).map(|q| q.points).sum();
    let avg_rating = if total > 0 {
        quests.iter().map(|q| q.rating).sum::<f64>() / total as f64
    } else {
        0.0
    };

    // Category breakdown
    let mut cat_map = std::collections::HashMap::new();
    for q in quests {
        *cat_map.entry(q.category.clone()).or_insert(0usize) += 1;
    }
    let mut categories: Vec<CategoryCount> = cat_map
        .into_iter()
        .map(|(category, count)| CategoryCount { category, count })
        .collect();
    categories.sort_by(|a, b| b.count.cmp(&a.count));

    AggregateStats {
        total_quests: total,
        completed_count: completed,
        total_points,
        average_rating: avg_rating,
        categories,
        completion_rate: if total > 0 { completed as f64 / total as f64 } else { 0.0 },
    }
}

// ─── JSON FFI ──────────────────────────────────────────

/// Parse JSON array of quests and return filtered results as JSON string.
pub fn filter_quests_json(input_json: &str, params_json: &str) -> String {
    let quests: Vec<QuestData> = match serde_json::from_str(input_json) {
        Ok(q) => q,
        Err(e) => return format!("{{\"error\": \"{}\"}}", e),
    };
    let params: FilterParams = match serde_json::from_str(params_json) {
        Ok(p) => p,
        Err(e) => return format!("{{\"error\": \"{}\"}}", e),
    };

    let result = filter_quests(&quests, &params);
    serde_json::to_string(&result).unwrap_or_default()
}

// ─── Tests ─────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_quests() -> Vec<QuestData> {
        vec![
            QuestData {
                id: "1".into(), title: "Таємниці Старого Міста".into(),
                description: "Історичний маршрут".into(), category: "Історія".into(),
                difficulty: "Середньо".into(), points: 180, completed: false,
                rating: 4.8, participants: 1247,
            },
            QuestData {
                id: "2".into(), title: "Парковий Квест".into(),
                description: "Прогулянка парком".into(), category: "Природа".into(),
                difficulty: "Легко".into(), points: 90, completed: true,
                rating: 4.6, participants: 892,
            },
        ]
    }

    #[test]
    fn test_filter_by_category() {
        let quests = sample_quests();
        let params = FilterParams {
            category: Some("Історія".into()),
            difficulty: None, completed: None,
            min_rating: None, search_query: None,
            sort_by: None, limit: None,
        };
        let result = filter_quests(&quests, &params);
        assert_eq!(result.len(), 1);
        assert_eq!(result[0].title, "Таємниці Старого Міста");
    }

    #[test]
    fn test_fuzzy_search() {
        let quests = sample_quests();
        let results = fuzzy_search(&quests, "парк", 10);
        assert!(!results.is_empty());
        assert_eq!(results[0].title, "Парковий Квест");
    }

    #[test]
    fn test_aggregate() {
        let quests = sample_quests();
        let stats = aggregate_stats(&quests);
        assert_eq!(stats.total_quests, 2);
        assert_eq!(stats.completed_count, 1);
        assert_eq!(stats.total_points, 90);
    }
}
