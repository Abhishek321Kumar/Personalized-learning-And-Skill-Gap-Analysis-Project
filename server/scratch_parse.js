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

// Find the index of "Education" to bound our search, or just search all lines
let eduStartIndex = linesArr.findIndex(l => l.toLowerCase().includes("education"));
let eduEndIndex = linesArr.findIndex((l, i) => i > eduStartIndex && (l.toLowerCase().includes("experience") || l.toLowerCase().includes("projects") || l.toLowerCase().includes("skills")));
if (eduStartIndex === -1) eduStartIndex = 0;
if (eduEndIndex === -1) eduEndIndex = linesArr.length;

const eduLines = linesArr; // Just use all lines if we are doing a loose heuristic, but bounded is better.

const extractDate = (lines, centerIdx) => {
    for (let i = Math.max(0, centerIdx - 2); i <= Math.min(lines.length - 1, centerIdx + 2); i++) {
        const matches = lines[i].match(/(?:19|20)\d{2}/g);
        if (matches) return matches[matches.length - 1]; // last year mentioned (often graduation)
    }
    return "";
};

const extractCGPA = (lines, centerIdx) => {
    for (let i = Math.max(0, centerIdx - 2); i <= Math.min(lines.length - 1, centerIdx + 2); i++) {
        const match = lines[i].match(/(?:cgpa|gpa|percentage|score)[\s:]*([0-9.]+)/i);
        if (match) return match[1];
    }
    return "";
};

const extractUniversity = (lines, centerIdx) => {
    const keywords = ['college', 'university', 'institute', 'school', 'academy', 'technology', 'management'];
    for (let i = Math.max(0, centerIdx - 2); i <= Math.min(lines.length - 1, centerIdx + 2); i++) {
        if (i === centerIdx) continue;
        const lowerLine = lines[i].toLowerCase();
        if (keywords.some(kw => lowerLine.includes(kw))) {
            return lines[i].split(',')[0].trim(); // drop location if any
        }
    }
    return "";
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
