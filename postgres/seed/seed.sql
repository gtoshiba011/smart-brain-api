BEGIN TRANSACTION;

INSERT into users (name, email, joined) values ('Tim', 'tim@gmail.com', '2020-01-01');
INSERT into login (hash, email) values ('$2b$10$ddsD5sBbZD3U5jHRbQqu8.dBRrK0pAdzWgCsEabYORMjdr.zXU4Si', 'tim@gmail.com');

COMMIT; 