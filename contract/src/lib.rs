use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::store::IterableMap;
use near_sdk::{near, env, AccountId, PanicOnDefault, base64, serde};
use near_sdk::json_types::U64;

#[near(serializers=[json, borsh])]
#[derive(Clone)]
pub struct FileInfo {
    pub name: String,
    pub url: String,
    pub timestamp: U64,
    pub owner: AccountId,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    pub files: IterableMap<String, FileInfo>,
}

#[near]
impl Contract {
    #[init]
    #[private]
    pub fn new() -> Self {
        Self {
            files: IterableMap::new(b"f"),
        }
    }

    #[payable]
    pub fn add_file(&mut self, name: String, url: String) -> String {
        let account_id = env::predecessor_account_id();
        let file_hash = env::sha256(name.as_bytes());
        let file_hash = base64::encode(&file_hash);
        
        let file_info = FileInfo {
            name: name,
            url: url,
            timestamp: U64::from(env::block_timestamp()),
            owner: account_id.clone(),
        };

        self.files.insert(file_hash.clone(), file_info);
        file_hash
    }

    pub fn get_file(&self, file_hash: String) -> Option<FileInfo> {
        self.files.get(&file_hash).clone().cloned()
    }

    pub fn get_user_files(&self, account_id: AccountId) -> Vec<FileInfo> {
        let mut user_files = Vec::new();
        let mut start = 0;
        let limit = 100; // Limit the number of files returned

        while let Some((_, file_info)) = self.files.iter().skip(start).next() {
            if file_info.owner == account_id {
                user_files.push(file_info.clone());
                if user_files.len() >= limit {
                    break;
                }
            }
            start += 1;
        }

        user_files
    }

    #[payable]
    pub fn delete_file(&mut self, file_hash: String) {
        let account_id = env::predecessor_account_id();
        if let Some(file_info) = self.files.get(&file_hash) {
            assert_eq!(file_info.owner, account_id, "Only the owner can delete the file");
            self.files.remove(&file_hash);
        }
    }
} 