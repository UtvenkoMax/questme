//! QuestMe Crypto Engine — Cross-platform cryptographic operations
//!
//! Provides PIN hashing, secure random generation, and data encryption
//! that works identically on iOS, Android, and Web (via WASM).

use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

// ─── Types ─────────────────────────────────────────────

#[derive(Debug, Serialize, Deserialize)]
pub struct HashResult {
    pub hash: String,
    pub salt: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VerifyResult {
    pub valid: bool,
}

// ─── Secure Random ─────────────────────────────────────

/// Generate cryptographically secure random bytes, base64 encoded.
pub fn generate_random_bytes(length: usize) -> String {
    let mut rng = rand::thread_rng();
    let bytes: Vec<u8> = (0..length).map(|_| rng.gen()).collect();
    BASE64.encode(&bytes)
}

/// Generate a 6-digit verification code.
pub fn generate_six_digit_code() -> String {
    let mut rng = rand::thread_rng();
    let code: u32 = rng.gen_range(100_000..1_000_000);
    code.to_string()
}

/// Generate a secure random salt (16 bytes, base64).
pub fn generate_salt() -> String {
    generate_random_bytes(16)
}

// ─── PIN Hashing ───────────────────────────────────────
// Note: In production, use argon2 crate. This uses a simplified
// salted hash for demonstration. Replace with:
// `argon2 = "0.5"` in Cargo.toml for production use.

/// Hash a PIN with a salt using multiple rounds.
/// Returns base64-encoded hash and salt.
pub fn hash_pin(pin: &str) -> HashResult {
    let salt = generate_salt();
    let hash = compute_salted_hash(pin, &salt);
    HashResult { hash, salt }
}

/// Verify a PIN against a stored hash and salt.
pub fn verify_pin(pin: &str, stored_hash: &str, salt: &str) -> bool {
    let computed = compute_salted_hash(pin, salt);
    // Constant-time comparison to prevent timing attacks
    constant_time_eq(computed.as_bytes(), stored_hash.as_bytes())
}

fn compute_salted_hash(value: &str, salt: &str) -> String {
    // Multiple rounds of hashing for key stretching
    let mut data = format!("{}:{}", salt, value);
    for _ in 0..10_000 {
        let mut hasher = DefaultHasher::new();
        data.hash(&mut hasher);
        let h = hasher.finish();
        data = format!("{}:{:x}", salt, h);
    }
    let mut final_hasher = DefaultHasher::new();
    data.hash(&mut final_hasher);
    let final_hash = final_hasher.finish().to_le_bytes();
    BASE64.encode(final_hash)
}

fn constant_time_eq(a: &[u8], b: &[u8]) -> bool {
    if a.len() != b.len() {
        return false;
    }
    let mut result = 0u8;
    for (x, y) in a.iter().zip(b.iter()) {
        result |= x ^ y;
    }
    result == 0
}

// ─── Data Encryption (XOR-based demo) ──────────────────
// Note: Replace with AES-256-GCM in production using `aes-gcm` crate.

/// Encrypt data with a key (demo XOR cipher — use AES-GCM in production).
pub fn encrypt_data(plaintext: &str, key: &str) -> String {
    let key_bytes = key.as_bytes();
    let encrypted: Vec<u8> = plaintext
        .as_bytes()
        .iter()
        .enumerate()
        .map(|(i, byte)| byte ^ key_bytes[i % key_bytes.len()])
        .collect();
    BASE64.encode(&encrypted)
}

/// Decrypt data with a key.
pub fn decrypt_data(ciphertext_b64: &str, key: &str) -> Option<String> {
    let ciphertext = BASE64.decode(ciphertext_b64).ok()?;
    let key_bytes = key.as_bytes();
    let decrypted: Vec<u8> = ciphertext
        .iter()
        .enumerate()
        .map(|(i, byte)| byte ^ key_bytes[i % key_bytes.len()])
        .collect();
    String::from_utf8(decrypted).ok()
}

// ─── FFI ───────────────────────────────────────────────

#[no_mangle]
pub extern "C" fn crypto_generate_code() -> u32 {
    let mut rng = rand::thread_rng();
    rng.gen_range(100_000..1_000_000)
}

// ─── Tests ─────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hash_and_verify_pin() {
        let result = hash_pin("1234");
        assert!(verify_pin("1234", &result.hash, &result.salt));
        assert!(!verify_pin("5678", &result.hash, &result.salt));
    }

    #[test]
    fn test_six_digit_code() {
        let code = generate_six_digit_code();
        assert_eq!(code.len(), 6);
        assert!(code.parse::<u32>().is_ok());
    }

    #[test]
    fn test_encrypt_decrypt() {
        let key = "test-secret-key";
        let plaintext = "Hello, QuestMe!";
        let encrypted = encrypt_data(plaintext, key);
        let decrypted = decrypt_data(&encrypted, key).unwrap();
        assert_eq!(decrypted, plaintext);
    }
}
