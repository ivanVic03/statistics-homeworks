CREATE TABLE CyberIncidenti (
    id INT PRIMARY KEY,
    gravita INT,
    categoria varchar(20)
);

INSERT INTO CyberIncidenti (id, gravita, categoria) VALUES
(1, 2, 'phishing'),
(2, 3, 'malware'),
(3, 1, 'brute-force'),
(4, 2, 'phishing'),
(5, 4, 'ransomware'),
(6, 3, 'malware'),
(7, 1, 'brute-force'),
(8, 3, 'malware'),
(9, 5, 'ransomware'),
(10, 2, 'phishing'),
(11, 2, 'brute-force'),
(12, 4, 'malware'),
(13, 1, 'phishing'),
(14, 2, 'phishing'),
(15, 5, 'ransomware'),
(16, 1, 'brute-force'),
(17, 3, 'malware'),
(18, 1, 'phishing'),
(19, 4, 'malware'),
(20, 5, 'ransomware');
