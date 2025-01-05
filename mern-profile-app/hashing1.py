import hashlib
import os

def hash_password(password: str) -> str:
    # Generate a random salt
    salt = os.urandom(16)
    # Combine the salt with the password and hash it using SHA-256
    hash_obj = hashlib.sha256(salt + password.encode('utf-8'))
    hashed_password = hash_obj.hexdigest()
    # Combine the salt and the hashed password for storage
    salt_and_hashed_password = salt.hex() + hashed_password
    return salt_and_hashed_password

def check_password(stored_password: str, provided_password: str) -> bool:
    # Extract the salt from the stored password
    salt = bytes.fromhex(stored_password[:32])
    # Extract the hashed password from the stored password
    hashed_password = stored_password[32:]
    # Hash the provided password with the same salt
    hash_obj = hashlib.sha256(salt + provided_password.encode('utf-8'))
    provided_hashed_password = hash_obj.hexdigest()
    # Compare the hashed passwords
    return provided_hashed_password == hashed_password

# Example usage:
password = "my_secure_password"
hashed_password = hash_password(password)
print(f"Hashed password: {hashed_password}")

# To verify the password later:
is_correct = check_password(hashed_password, "my_secure_password")
print(f"Password is correct: {is_correct}")