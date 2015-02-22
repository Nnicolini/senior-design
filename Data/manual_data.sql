USE `kaching`;

INSERT INTO user(username, password, salt) VALUES('test', 'WcDYdWCOinWESwuAANDbAl8baMT0Cr18CLq7EiXAd74=','testtesttesttest');

#INSERT INTO user_info(`user_id`, first_name, last_name, email, address, phone_number) VALUES(1, 'test', 'test', 'test@test.test', '123 test street', '9999999999');

INSERT INTO account_type(`type`) VALUES('Checking');
INSERT INTO account_type(`type`) VALUES('Savings');
INSERT INTO account_type(`type`) VALUES('Credit');

INSERT INTO account(user_id, account_type_id, `number`, name, interest_rate, balance) VALUES(1, 1, '1111111111', 'Checking 1',  0.0001, 100.00);
INSERT INTO account(user_id, account_type_id, `number`, name, interest_rate, balance) VALUES(1, 2, '1111111112', 'Savings',  0.0010, 550.00);
INSERT INTO account(user_id, account_type_id, `number`, name, interest_rate, balance) VALUES(1, 2, '1111111113', 'Long-term savings',  0.0100, 1200.00);
INSERT INTO account(user_id, account_type_id, `number`, name, interest_rate, balance) VALUES(1, 1, '1111111114', 'Checking 2',  0.0000, 0.00);
INSERT INTO account(user_id, account_type_id, `number`, name, interest_rate, balance) VALUES(1, 2, '1111111115', 'Investing account',  0.1001, 25.75);

INSERT INTO credit_account(`user_id`, `account_type_id`, `number`, `cvv`, `name`, `expiry_date`, `balance`, `limit`) VALUES(1, 3, '1111111111111111', '111', 'Test Card 1', MAKEDATE(2016, 1), 100.00, 1000.00);
INSERT INTO credit_account(`user_id`, `account_type_id`, `number`, `cvv`, `name`, `expiry_date`, `balance`, `limit`) VALUES(1, 3, '1111111111111112', '112', 'Test Card 2', MAKEDATE(2016, 1), 500.00, 10000.00);

INSERT INTO history(`account_number`, `transaction_type`, `amount`, `datetime`) VALUES('1111111111', 'Deposit', 10.00, NOW());
INSERT INTO history(`account_number`, `transaction_type`, `amount`, `datetime`) VALUES('1111111111', 'Withdraw', 100.00, NOW());


