-- Ariano Flight Booking System Database Schema
-- Generated for MySQL 8.0+

-- Create database
CREATE DATABASE IF NOT EXISTS ariano_flight_booking;
USE ariano_flight_booking;

-- User table (LOGINPF)
CREATE TABLE users (
    userId VARCHAR(5) PRIMARY KEY,
    userPass VARCHAR(20) NOT NULL,
    userRole ENUM('Admin', 'Airline', 'Customer') NOT NULL,
    lastLogin DATETIME NULL,
    userQstn VARCHAR(30) NULL,
    userAnswr VARCHAR(30) NULL,
    status ENUM('A', 'I', 'R', 'D') DEFAULT 'A',
    remark VARCHAR(15) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customer table (CUSTPF)
CREATE TABLE customers (
    usrId VARCHAR(5) PRIMARY KEY,
    usrName VARCHAR(20) NOT NULL,
    usrDOB DATE NOT NULL,
    usrGender ENUM('M', 'F', 'O') NOT NULL,
    usrMobNum VARCHAR(10) NOT NULL,
    usrEmail VARCHAR(50) NOT NULL,
    usrCity VARCHAR(20) NOT NULL,
    usrPinCode INT(6) NOT NULL,
    usrState VARCHAR(20) NOT NULL,
    usrAddress VARCHAR(100) NOT NULL,
    usrAadhar VARCHAR(12) NOT NULL,
    usrStatus ENUM('A', 'I') DEFAULT 'A',
    usrRemark VARCHAR(15) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usrId) REFERENCES users(userId) ON DELETE CASCADE
);

-- Airline table (AIRMASTER)
CREATE TABLE airlines (
    airId VARCHAR(5) PRIMARY KEY,
    airName VARCHAR(20) NOT NULL,
    airMobNum VARCHAR(10) NOT NULL,
    airEmail VARCHAR(50) NOT NULL,
    airCity VARCHAR(20) NOT NULL,
    airPinCode INT(6) NOT NULL,
    airState VARCHAR(20) NOT NULL,
    airAddress VARCHAR(100) NOT NULL,
    airFleet INT(5) NOT NULL,
    airEstDate DATE NOT NULL,
    airRating DECIMAL(2,1) NULL,
    airStatus ENUM('A', 'I', 'R', 'D') DEFAULT 'A',
    airRemark VARCHAR(15) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (airId) REFERENCES users(userId) ON DELETE CASCADE
);

-- Flight table (FLTMASTER)
CREATE TABLE flights (
    fltId VARCHAR(5) PRIMARY KEY,
    airId VARCHAR(5) NOT NULL,
    fltRange INT NOT NULL,
    fltFuelCap INT NOT NULL,
    airModel VARCHAR(5) NOT NULL,
    fltTotSeat INT NOT NULL,
    fltOrigin VARCHAR(20) NOT NULL,
    fltDest VARCHAR(20) NOT NULL,
    fltTkPrice INT NOT NULL,
    fltArrTime TIME NOT NULL,
    fltDepTime TIME NOT NULL,
    fltEndTime TIME NOT NULL,
    fltTotDur TIME NOT NULL,
    fltCabBag INT NOT NULL,
    fltMainBag INT NOT NULL,
    fltStatus ENUM('A', 'I') DEFAULT 'A',
    fltRemark VARCHAR(15) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (airId) REFERENCES airlines(airId) ON DELETE CASCADE
);

-- Passenger table (PSGPF)
CREATE TABLE passengers (
    psgId VARCHAR(5) PRIMARY KEY,
    usrId VARCHAR(5) NOT NULL,
    psgName VARCHAR(20) NOT NULL,
    psgGender ENUM('M', 'F', 'O') NOT NULL,
    psgAge INT NOT NULL,
    psgRltn VARCHAR(10) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usrId) REFERENCES users(userId) ON DELETE CASCADE
);

-- Booking table (BOOKPF)
CREATE TABLE bookings (
    bkId VARCHAR(5) PRIMARY KEY,
    usrId VARCHAR(5) NOT NULL,
    fltId VARCHAR(5) NOT NULL,
    bkDate DATE NOT NULL,
    bkDepDate DATE NOT NULL,
    bkStatus ENUM('U', 'C', 'P', 'R', 'W') DEFAULT 'U',
    bkRemark VARCHAR(15) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usrId) REFERENCES users(userId) ON DELETE CASCADE,
    FOREIGN KEY (fltId) REFERENCES flights(fltId) ON DELETE CASCADE
);

-- Ticket table (TKTPF)
CREATE TABLE tickets (
    tktId VARCHAR(5) PRIMARY KEY,
    bkId VARCHAR(5) NOT NULL,
    psgId VARCHAR(5) NOT NULL,
    tktSeatNum INT NOT NULL,
    tktStatus ENUM('U', 'C', 'P', 'R', 'W') DEFAULT 'U',
    tktRemark VARCHAR(15) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bkId) REFERENCES bookings(bkId) ON DELETE CASCADE,
    FOREIGN KEY (psgId) REFERENCES passengers(psgId) ON DELETE CASCADE
);

-- Rating table (RATINGPF)
CREATE TABLE ratings (
    usrId VARCHAR(5) NOT NULL,
    fltId VARCHAR(5) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback VARCHAR(50) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (usrId, fltId),
    FOREIGN KEY (usrId) REFERENCES users(userId) ON DELETE CASCADE,
    FOREIGN KEY (fltId) REFERENCES flights(fltId) ON DELETE CASCADE
);

-- Grievance table (GRVCPF)
CREATE TABLE grievances (
    grvId VARCHAR(5) PRIMARY KEY,
    usrId VARCHAR(5) NOT NULL,
    fltId VARCHAR(5) NOT NULL,
    complaint VARCHAR(100) NOT NULL,
    response VARCHAR(100) NULL,
    status ENUM('P', 'R') DEFAULT 'P',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usrId) REFERENCES users(userId) ON DELETE CASCADE,
    FOREIGN KEY (fltId) REFERENCES flights(fltId) ON DELETE CASCADE
);

-- Control table (CTRLPF)
CREATE TABLE controls (
    keyField1 VARCHAR(10) NOT NULL,
    keyField2 VARCHAR(10) NOT NULL,
    value VARCHAR(10) NOT NULL,
    description VARCHAR(15) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (keyField1, keyField2, value)
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(userRole);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_customers_email ON customers(usrEmail);
CREATE INDEX idx_customers_mobile ON customers(usrMobNum);
CREATE INDEX idx_airlines_email ON airlines(airEmail);
CREATE INDEX idx_airlines_mobile ON airlines(airMobNum);
CREATE INDEX idx_flights_airline ON flights(airId);
CREATE INDEX idx_flights_origin_dest ON flights(fltOrigin, fltDest);
CREATE INDEX idx_flights_status ON flights(fltStatus);
CREATE INDEX idx_bookings_user ON bookings(usrId);
CREATE INDEX idx_bookings_flight ON bookings(fltId);
CREATE INDEX idx_bookings_status ON bookings(bkStatus);
CREATE INDEX idx_tickets_booking ON tickets(bkId);
CREATE INDEX idx_tickets_passenger ON tickets(psgId);
CREATE INDEX idx_tickets_status ON tickets(tktStatus);
CREATE INDEX idx_grievances_user ON grievances(usrId);
CREATE INDEX idx_grievances_flight ON grievances(fltId);
CREATE INDEX idx_grievances_status ON grievances(status);

-- Insert sample data for testing

-- Insert admin user
INSERT INTO users (userId, userPass, userRole, status) VALUES
('ADM01', '$2a$08$hashedpassword', 'Admin', 'A');

-- Insert sample airlines
INSERT INTO users (userId, userPass, userRole, status) VALUES
('AIR01', '$2a$08$hashedpassword', 'Airline', 'A'),
('AIR02', '$2a$08$hashedpassword', 'Airline', 'A');

INSERT INTO airlines (airId, airName, airMobNum, airEmail, airCity, airPinCode, airState, airAddress, airFleet, airEstDate, airStatus) VALUES
('AIR01', 'Ariano Airlines', '9876543210', 'info@arianoair.com', 'Mumbai', 400001, 'Maharashtra', 'Andheri East, Mumbai', 50, '2020-01-01', 'A'),
('AIR02', 'SkyHigh Airways', '9876543211', 'info@skyhigh.com', 'Delhi', 110001, 'Delhi', 'Connaught Place, Delhi', 30, '2019-06-15', 'A');

-- Insert sample flights
INSERT INTO flights (fltId, airId, fltRange, fltFuelCap, airModel, fltTotSeat, fltOrigin, fltDest, fltTkPrice, fltArrTime, fltDepTime, fltEndTime, fltTotDur, fltCabBag, fltMainBag, fltStatus) VALUES
('FLT01', 'AIR01', 1500, 5000, 'B737', 150, 'Mumbai', 'Delhi', 5000, '10:00:00', '08:00:00', '10:00:00', '02:00:00', 7, 20, 'A'),
('FLT02', 'AIR01', 1200, 4000, 'A320', 120, 'Delhi', 'Bangalore', 4500, '14:00:00', '12:00:00', '14:00:00', '02:00:00', 7, 20, 'A'),
('FLT03', 'AIR02', 800, 3000, 'B777', 200, 'Mumbai', 'Chennai', 3500, '16:00:00', '14:00:00', '16:00:00', '02:00:00', 7, 20, 'A');

-- Insert sample customers
INSERT INTO users (userId, userPass, userRole, userQstn, userAnswr, status) VALUES
('CUST1', '$2a$08$hashedpassword', 'Customer', 'What is your pet name?', 'Tommy', 'A'),
('CUST2', '$2a$08$hashedpassword', 'Customer', 'What is your favorite color?', 'Blue', 'A');

INSERT INTO customers (usrId, usrName, usrDOB, usrGender, usrMobNum, usrEmail, usrCity, usrPinCode, usrState, usrAddress, usrAadhar, usrStatus) VALUES
('CUST1', 'John Doe', '1990-05-15', 'M', '9876543210', 'john.doe@email.com', 'Mumbai', 400001, 'Maharashtra', 'Bandra West, Mumbai', '123456789012', 'A'),
('CUST2', 'Jane Smith', '1985-08-20', 'F', '9876543211', 'jane.smith@email.com', 'Delhi', 110001, 'Delhi', 'Karol Bagh, Delhi', '123456789013', 'A');

-- Insert sample passengers
INSERT INTO passengers (psgId, usrId, psgName, psgGender, psgAge, psgRltn) VALUES
('PSG01', 'CUST1', 'John Doe', 'M', 33, 'Self'),
('PSG02', 'CUST1', 'Mary Doe', 'F', 30, 'Spouse'),
('PSG03', 'CUST2', 'Jane Smith', 'F', 38, 'Self');

-- Insert sample bookings
INSERT INTO bookings (bkId, usrId, fltId, bkDate, bkDepDate, bkStatus) VALUES
('BK001', 'CUST1', 'FLT01', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'U'),
('BK002', 'CUST2', 'FLT02', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 'U');

-- Insert sample tickets
INSERT INTO tickets (tktId, bkId, psgId, tktSeatNum, tktStatus) VALUES
('TKT01', 'BK001', 'PSG01', 15, 'U'),
('TKT02', 'BK001', 'PSG02', 16, 'U'),
('TKT03', 'BK002', 'PSG03', 25, 'U');

-- Insert sample ratings
INSERT INTO ratings (usrId, fltId, rating, feedback) VALUES
('CUST1', 'FLT01', 4, 'Good flight experience'),
('CUST2', 'FLT02', 5, 'Excellent service');

-- Insert sample grievances
INSERT INTO grievances (grvId, usrId, fltId, complaint, status) VALUES
('GRV01', 'CUST1', 'FLT01', 'Flight was delayed by 2 hours', 'P');

-- Insert control data
INSERT INTO controls (keyField1, keyField2, value, description) VALUES
('SYSTEM', 'VERSION', '1.0', 'System Version'),
('BOOKING', 'MAX_PASS', '9', 'Max Passengers'),
('BOOKING', 'ADV_DAYS', '30', 'Advance Booking');

COMMIT;
