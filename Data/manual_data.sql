USE `kaboom`;

INSERT INTO users(username, password, salt) VALUES('test', 'WcDYdWCOinWESwuAANDbAl8baMT0Cr18CLq7EiXAd74=','testtesttesttest');

INSERT INTO accounts(user_id, `number`, balance, name, type, interes_rate) VALUES(1, '1111111111', 100.00, 'Checking 1', 'Checking', 0.0001);
INSERT INTO accounts(user_id, `number`, balance, name, type, interes_rate) VALUES(1, '1111111112', 550.00, 'Savings', 'Savings', 0.0010);
INSERT INTO accounts(user_id, `number`, balance, name, type, interes_rate) VALUES(1, '1111111113', 1200.00, 'Long-term savings', 'Savings', 0.0100);
INSERT INTO accounts(user_id, `number`, balance, name, type, interes_rate) VALUES(1, '1111111114', 0.00, 'Checking 2', 'Checking', 0.0001);
INSERT INTO accounts(user_id, `number`, balance, name, type, interes_rate) VALUES(1, '1111111115', 25.75, 'Investing account', 'Checking', 0.1001);

INSERT INTO history(`account_number`, `transaction_type`, `amount`, `datetime`) VALUES('1111111111', 'Deposit', 10.00, NOW());
INSERT INTO history(`account_number`, `transaction_type`, `amount`, `datetime`) VALUES('1111111111', 'Withdraw', 100.00, NOW());
