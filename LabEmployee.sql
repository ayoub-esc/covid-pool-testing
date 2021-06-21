USE finalproject;
CREATE TABLE LabEmployee (
labID VARCHAR(50) PRIMARY KEY, 
password VARCHAR(50)
);

INSERT INTO LabEmployee
VALUES ("labtech1","techpass1");


CREATE TABLE Employee (
employeeID VARCHAR(20) PRIMARY KEY, 
email VARCHAR(50) UNIQUE,
firstName VARCHAR(50),
lastName VARCHAR(50),
passcode VARCHAR(50)
);


CREATE TABLE EmployeeTest (
testBarcode VARCHAR(50) PRIMARY KEY, 
employeeID VARCHAR(20),
collectedBy  VARCHAR(50),
collectionTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (employeeID) REFERENCES Employee(employeeID),
FOREIGN KEY (collectedBy) REFERENCES LabEmployee(labID)
);

INSERT INTO Employee
VALUES ("1","emp1@gmail.com","Bob","Rob","12345");

INSERT INTO Employee
VALUES ("2","emp2@gmail.com","Jay","Rob","12345");

INSERT INTO Employee
VALUES ("3","emp3@gmail.com","Smith","Rob","12345");


CREATE TABLE Pool ( 
poolBarcode VARCHAR(50) PRIMARY KEY);


CREATE TABLE PoolMap ( 
poolBarcode VARCHAR(50),
testBarcode VARCHAR(50),
FOREIGN KEY (poolBarcode) REFERENCES Pool(poolBarcode),
FOREIGN KEY (testBarcode) REFERENCES EmployeeTest(testBarcode)

);

CREATE TABLE Well ( 
wellBarcode VARCHAR(50) PRIMARY KEY
);

CREATE TABLE WellTesting (
poolBarcode VARCHAR(50) PRIMARY KEY, 
wellBarcode  VARCHAR(50),
result VARCHAR(20),
FOREIGN KEY (poolBarcode) REFERENCES Pool(poolBarcode),
FOREIGN KEY (wellBarcode) REFERENCES Well(wellBarcode)
);

Select DATE_FORMAT((collectionTime), '%d/%m/%Y') AS Time , employeeID FROM EmployeeTest;





