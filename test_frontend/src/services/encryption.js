// Utility functions for encryption and password management
export class EncryptionService {
  static async setupPassword(password) {
    // Generate encryption key
    const userKey = await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256
      },
      true,
      ["encrypt", "decrypt"]
    );
    
    // Create a salt for password hashing
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Hash the password with salt
    const passwordHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(password + salt)
    );
    
    // Export the key to store it
    const exportedKey = await crypto.subtle.exportKey('raw', userKey);
    console.log('Exported key length:', exportedKey.byteLength);
    
    // Create a key from the password hash for encrypting the user key
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      passwordHash.slice(0, 32), // Ensure we use exactly 32 bytes (256 bits)
      'AES-GCM',
      false,
      ['encrypt']
    );
    
    // Encrypt the exported key with the password hash
    const encryptedKey = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: salt
      },
      passwordKey,
      exportedKey
    );
    
    // Store everything in localStorage
    localStorage.setItem('has_password_setup', 'true');
    localStorage.setItem('password_salt', btoa(salt));
    localStorage.setItem('encrypted_key', btoa(encryptedKey));
    localStorage.setItem('user_password', password); // Store the password
    
    // Store decrypted key in sessionStorage
    const keyString = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedKey)));
    sessionStorage.setItem('user_key', keyString);
    
    return userKey;
  }

  static async verifyPassword(password) {
    // Get stored salt and encrypted key
    const salt = Uint8Array.from(atob(localStorage.getItem('password_salt')), c => c.charCodeAt(0));
    const encryptedKey = Uint8Array.from(atob(localStorage.getItem('encrypted_key')), c => c.charCodeAt(0));

    // Hash the entered password with stored salt
    const passwordHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(password + salt)
    );

    try {
      // Create a key from the password hash for decrypting the user key
      const passwordKey = await crypto.subtle.importKey(
        'raw',
        passwordHash.slice(0, 32), // Ensure we use exactly 32 bytes (256 bits)
        'AES-GCM',
        false,
        ['decrypt']
      );
      
      // Try to decrypt the key
      const decryptedKey = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: salt
        },
        passwordKey,
        encryptedKey
      );
      
      // Import the decrypted key
      const userKey = await crypto.subtle.importKey(
        'raw',
        decryptedKey,
        'AES-GCM',
        true,
        ['encrypt', 'decrypt']
      );
      
      // If successful, store the decrypted key in sessionStorage
      const keyString = btoa(String.fromCharCode.apply(null, new Uint8Array(decryptedKey)));
      sessionStorage.setItem('user_key', keyString);
      return userKey;
    } catch (error) {
      throw new Error('Invalid password');
    }
  }

  static async encryptFile(file) {
    // Get the key from sessionStorage and import it
    const storedKey = sessionStorage.getItem('user_key');
    console.log('Stored key length:', storedKey ? storedKey.length : 0);
    
    // Convert base64 string back to Uint8Array
    const keyBytes = new Uint8Array(atob(storedKey).split('').map(c => c.charCodeAt(0)));
    console.log('Key bytes length:', keyBytes.length);
    
    // Ensure we have exactly 32 bytes (256 bits)
    if (keyBytes.length !== 32) {
      console.error('Invalid key length:', keyBytes.length);
      throw new Error('Invalid encryption key length');
    }
    
    // Import the key
    const userKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      'AES-GCM',
      true,
      ['encrypt']
    );
    
    // Read file content
    const fileContent = await file.arrayBuffer();
    
    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(16));
    
    // Encrypt file content
    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      userKey,
      fileContent
    );
    
    // Combine IV and encrypted content
    const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedContent), iv.length);
    
    return new Blob([combined]);
  }

  static async decryptFile(encryptedData) {
    // Get the key from sessionStorage and import it
    const storedKey = sessionStorage.getItem('user_key');
    const keyBytes = new Uint8Array(atob(storedKey).split('').map(c => c.charCodeAt(0)));
    
    // Import the key
    const userKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      'AES-GCM',
      true,
      ['decrypt']
    );
    
    // Extract IV (first 16 bytes) and encrypted content
    const iv = encryptedData.slice(0, 16);
    const encryptedContent = encryptedData.slice(16);
    
    // Decrypt content
    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      userKey,
      encryptedContent
    );
    
    return decryptedContent;
  }

  static hasPasswordSetup() {
    return localStorage.getItem('has_password_setup') === 'true';
  }

  static hasActiveSession() {
    return !!sessionStorage.getItem('user_key');
  }

  static clearSession() {
    sessionStorage.removeItem('user_key');
  }

  static clearAllData() {
    // Clear localStorage
    localStorage.removeItem('has_password_setup');
    localStorage.removeItem('password_salt');
    localStorage.removeItem('encrypted_key');
    
    // Clear sessionStorage
    sessionStorage.removeItem('user_key');
  }

  static getStoredPassword() {
    // Get the stored password from localStorage
    return localStorage.getItem('user_password');
  }
} 