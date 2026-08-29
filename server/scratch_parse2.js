const extractedText = `
ABHISHEK ANIL KUMAR
jithuaakabhishek123@gmail.com +91-8884922174 Linkedin Github
Education
BMS Institute of Technology and Management, Bengaluru
Master of Computer Applications (MCA), CGPA: 8.65
Nov 2025 - Present
Jul 2019 - Jul 2022
Bachelor of Computer Applications (BCA), CGPA: 9.13
Presidency College, Bengaluru
Work Experience
Indegene, Bengaluru, India
`;

const linesArr = extractedText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
const education = {};

// Helper to search radiating outwards from centerIdx: distance 0, then 1 (both above and below), then 2, etc.
const searchOutwards = (lines, centerIdx, maxDist, matcher) => {
    // Check center
    let res = matcher(lines[centerIdx]);
    if (res) return res;

    for (let dist = 1; dist <= maxDist; dist++) {
        // Check below (if available)
        if (centerIdx + dist < lines.length) {
            res = matcher(lines[centerIdx + dist]);
            if (res) return res;
        }
        // Check above (if available)
        if (centerIdx - dist >= 0) {
            res = matcher(lines[centerIdx - dist]);
            if (res) return res;
        }
    }
    return "";
};

const extractDate = (lines, centerIdx) => {
    return searchOutwards(lines, centerIdx, 2, (line) => {
        const matches = line.match(/(?:19|20)\d{2}/g);
        if (matches) return matches[matches.length - 1];
        return null;
    });
};

const extractCGPA = (lines, centerIdx) => {
    return searchOutwards(lines, centerIdx, 2, (line) => {
        const match = line.match(/(?:cgpa|gpa|percentage|score)[\s:]*([0-9.]+)/i);
        if (match) return match[1];
        return null;
    });
};

const extractUniversity = (lines, centerIdx) => {
    const keywords = ['college', 'university', 'institute', 'school', 'academy', 'technology', 'management'];
    return searchOutwards(lines, centerIdx, 2, (line) => {
        const lowerLine = line.toLowerCase();
        // Ignore the degree line itself for university extraction
        if (lowerLine.includes("bachelor") || lowerLine.includes("master") || lowerLine.includes("degree")) return null;
        
        if (keywords.some(kw => lowerLine.includes(kw))) {
            return line.split(',')[0].trim();
        }
        return null;
    });
};

for (let i = 0; i < linesArr.length; i++) {
    const line = linesArr[i];
    const lowerLine = line.toLowerCase();
    
    // Detect PG
    if (lowerLine.includes("master") || lowerLine.includes("(mca)") || lowerLine.includes("m.sc") || lowerLine.includes("mba")) {
        education.hasPostgrad = true;
        if (lowerLine.includes("mca")) education.pgDegree = "MCA";
        else if (lowerLine.includes("mtech") || lowerLine.includes("m.tech")) education.pgDegree = "MTech";
        else if (lowerLine.includes("mba")) education.pgDegree = "MBA";
        else if (lowerLine.includes("msc") || lowerLine.includes("m.sc")) education.pgDegree = "MSc";
        else if (lowerLine.includes("mcom") || lowerLine.includes("m.com")) education.pgDegree = "MCom";
        else if (lowerLine.includes("me") || lowerLine.includes("m.e")) education.pgDegree = "ME";
        else education.pgDegree = "Other";

        education.pgYear = extractDate(linesArr, i);
        education.pgCgpa = extractCGPA(linesArr, i);
        education.pgUniversity = extractUniversity(linesArr, i);
    }

    // Detect UG
    if (lowerLine.includes("bachelor") || lowerLine.includes("(bca)") || lowerLine.includes("b.sc") || lowerLine.includes("btech")) {
        if (lowerLine.includes("bca")) education.ugDegree = "BCA";
        else if (lowerLine.includes("btech") || lowerLine.includes("b.tech")) education.ugDegree = "BTech";
        else if (lowerLine.includes("bba")) education.ugDegree = "BBA";
        else if (lowerLine.includes("bsc") || lowerLine.includes("b.sc")) education.ugDegree = "BSc";
        else if (lowerLine.includes("bcom") || lowerLine.includes("b.com")) education.ugDegree = "BCom";
        else if (lowerLine.includes("be") || lowerLine.includes("b.e")) education.ugDegree = "BE";
        else education.ugDegree = "Other";

        education.ugYear = extractDate(linesArr, i);
        education.ugCgpa = extractCGPA(linesArr, i);
        education.ugUniversity = extractUniversity(linesArr, i);
    }
}

console.log(education);
