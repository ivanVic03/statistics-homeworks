CREATE TABLE Cybercrimes (
    id INT PRIMARY KEY,
    gravity INT,
    category TEXT
);

INSERT INTO Cybercrimes (id, gravity, category) VALUES
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

SELECT gravity, COUNT(*) AS tot, ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM Cybercrimes), 2) AS pct
FROM Cybercrimes
GROUP BY gravity
ORDER BY gravity;

SELECT category, COUNT(*) AS tot, ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM Cybercrimes), 2) AS pct
FROM Cybercrimes
GROUP BY category
ORDER BY category;

SELECT category, gravity, COUNT(*) AS frequenza, ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM Cybercrimes), 2) AS bivariate_percentage
FROM Cybercrimes
GROUP BY category, gravity
ORDER BY category, gravity;




