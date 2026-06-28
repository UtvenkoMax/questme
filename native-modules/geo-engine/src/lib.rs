//! QuestMe Geo Engine — High-performance geographic calculations
//!
//! Provides batch haversine distance, geofence detection, point clustering,
//! and route optimization for the mobile app via FFI.

use serde::{Deserialize, Serialize};
use std::f64::consts::PI;

// ─── Types ─────────────────────────────────────────────

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Coordinate {
    pub latitude: f64,
    pub longitude: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NearbyResult {
    pub id: String,
    pub distance_meters: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Cluster {
    pub centroid: Coordinate,
    pub point_count: usize,
    pub point_indices: Vec<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuestPoint {
    pub id: String,
    pub coordinate: Coordinate,
}

// ─── Core Geo Functions ────────────────────────────────

const EARTH_RADIUS_METERS: f64 = 6_371_000.0;

fn to_radians(degrees: f64) -> f64 {
    degrees * PI / 180.0
}

/// Haversine distance between two coordinates in meters.
pub fn haversine_distance(a: &Coordinate, b: &Coordinate) -> f64 {
    let d_lat = to_radians(b.latitude - a.latitude);
    let d_lng = to_radians(b.longitude - a.longitude);
    let a_lat = to_radians(a.latitude);
    let b_lat = to_radians(b.latitude);

    let sin_d_lat = (d_lat / 2.0).sin();
    let sin_d_lng = (d_lng / 2.0).sin();
    let h = sin_d_lat * sin_d_lat + a_lat.cos() * b_lat.cos() * sin_d_lng * sin_d_lng;

    EARTH_RADIUS_METERS * 2.0 * h.sqrt().atan2((1.0 - h).sqrt())
}

/// Check if a point is inside a circular geofence.
pub fn is_inside_geofence(point: &Coordinate, center: &Coordinate, radius_meters: f64) -> bool {
    haversine_distance(point, center) <= radius_meters
}

/// Batch distance calculation from one point to many.
/// Returns sorted results (closest first).
pub fn batch_distances(origin: &Coordinate, points: &[QuestPoint]) -> Vec<NearbyResult> {
    let mut results: Vec<NearbyResult> = points
        .iter()
        .map(|p| NearbyResult {
            id: p.id.clone(),
            distance_meters: haversine_distance(origin, &p.coordinate),
        })
        .collect();

    results.sort_by(|a, b| a.distance_meters.partial_cmp(&b.distance_meters).unwrap());
    results
}

/// Filter points within a radius, sorted by distance.
pub fn find_nearby(
    origin: &Coordinate,
    points: &[QuestPoint],
    radius_meters: f64,
) -> Vec<NearbyResult> {
    batch_distances(origin, points)
        .into_iter()
        .filter(|r| r.distance_meters <= radius_meters)
        .collect()
}

/// Simple grid-based clustering for map markers.
/// Groups nearby points to avoid marker overlap at zoom levels.
pub fn cluster_points(points: &[Coordinate], cell_size_degrees: f64) -> Vec<Cluster> {
    use std::collections::HashMap;

    let mut grid: HashMap<(i64, i64), Vec<usize>> = HashMap::new();

    for (i, point) in points.iter().enumerate() {
        let cell_x = (point.longitude / cell_size_degrees).floor() as i64;
        let cell_y = (point.latitude / cell_size_degrees).floor() as i64;
        grid.entry((cell_x, cell_y)).or_default().push(i);
    }

    grid.into_values()
        .map(|indices| {
            let mut sum_lat = 0.0;
            let mut sum_lng = 0.0;
            for &i in &indices {
                sum_lat += points[i].latitude;
                sum_lng += points[i].longitude;
            }
            let count = indices.len() as f64;
            Cluster {
                centroid: Coordinate {
                    latitude: sum_lat / count,
                    longitude: sum_lng / count,
                },
                point_count: indices.len(),
                point_indices: indices,
            }
        })
        .collect()
}

/// Calculate total route distance in meters.
pub fn route_distance(route: &[Coordinate]) -> f64 {
    route
        .windows(2)
        .map(|pair| haversine_distance(&pair[0], &pair[1]))
        .sum()
}

/// Bearing from point A to point B in degrees (0-360).
pub fn bearing(from: &Coordinate, to: &Coordinate) -> f64 {
    let lat1 = to_radians(from.latitude);
    let lat2 = to_radians(to.latitude);
    let d_lng = to_radians(to.longitude - from.longitude);

    let x = d_lng.sin() * lat2.cos();
    let y = lat1.cos() * lat2.sin() - lat1.sin() * lat2.cos() * d_lng.cos();

    let bearing_rad = x.atan2(y);
    (bearing_rad * 180.0 / PI + 360.0) % 360.0
}

// ─── FFI Interface ─────────────────────────────────────

/// JSON-based FFI: Calculate distance between two points.
/// Input: `{"a": {"latitude": 50.45, "longitude": 30.52}, "b": {...}}`
/// Output: distance in meters as f64 string
#[no_mangle]
pub extern "C" fn geo_haversine_json(input_ptr: *const u8, input_len: usize) -> f64 {
    let input = unsafe { std::slice::from_raw_parts(input_ptr, input_len) };
    let input_str = match std::str::from_utf8(input) {
        Ok(s) => s,
        Err(_) => return -1.0,
    };

    #[derive(Deserialize)]
    struct Input {
        a: Coordinate,
        b: Coordinate,
    }

    match serde_json::from_str::<Input>(input_str) {
        Ok(parsed) => haversine_distance(&parsed.a, &parsed.b),
        Err(_) => -1.0,
    }
}

// ─── Tests ─────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_haversine_kyiv_landmarks() {
        let kontraktova = Coordinate { latitude: 50.4592, longitude: 30.5179 };
        let maidan = Coordinate { latitude: 50.4501, longitude: 30.5234 };
        let distance = haversine_distance(&kontraktova, &maidan);
        // ~1.1 km between these landmarks
        assert!(distance > 900.0 && distance < 1200.0);
    }

    #[test]
    fn test_geofence() {
        let center = Coordinate { latitude: 50.45, longitude: 30.52 };
        let inside = Coordinate { latitude: 50.4501, longitude: 30.5201 };
        let outside = Coordinate { latitude: 50.46, longitude: 30.54 };

        assert!(is_inside_geofence(&inside, &center, 200.0));
        assert!(!is_inside_geofence(&outside, &center, 200.0));
    }

    #[test]
    fn test_route_distance() {
        let route = vec![
            Coordinate { latitude: 50.4592, longitude: 30.5179 },
            Coordinate { latitude: 50.4612, longitude: 30.5167 },
            Coordinate { latitude: 50.4636, longitude: 30.5151 },
        ];
        let dist = route_distance(&route);
        assert!(dist > 400.0 && dist < 700.0);
    }

    #[test]
    fn test_clustering() {
        let points = vec![
            Coordinate { latitude: 50.45, longitude: 30.52 },
            Coordinate { latitude: 50.451, longitude: 30.521 },
            Coordinate { latitude: 50.47, longitude: 30.55 },
        ];
        let clusters = cluster_points(&points, 0.01);
        assert!(clusters.len() >= 1);
    }
}
