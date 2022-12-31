-- migrate:up
INSERT INTO tbl_login (
    email,password,type,status ) 
VALUES ('admin@querybox.xyz','$2b$10$HkdX9HE.e92UPw7C8qaUFeS5F.tSFOVzJ4bTSd6oLD/EUUDWUvILy','admin',true);

-- migrate:down
DELETE FROM tbl_login;

