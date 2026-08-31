import { useState, useEffect } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import { roleTemplates } from "../config/roleTemplates";
import { motion } from "framer-motion";
import { COUNTRY_CODES, LOCATION_DATA } from "../config/locationData";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const sortEducation = (eduArray) => {
  return [...(eduArray || [])].sort((a, b) => {
    const getRank = (level) => {
      const l = level?.toLowerCase() || "";
      if (l.includes("postgrad") || l.includes("phd") || l.includes("master") || l.includes("mca") || l.includes("mtech") || l.includes("msc") || l.includes("mba")) return 3;
      if (l.includes("undergrad") || l.includes("bachelor") || l.includes("degree") || l.includes("bca") || l.includes("btech") || l.includes("bsc") || l.includes("ba")) return 2;
      if (l.includes("high school") || l.includes("12") || l.includes("10") || l.includes("pu") || l.includes("secondary")) return 1;
      return 0;
    };
    return getRank(b.level) - getRank(a.level);
  });
};

export function ProfilePage({ user, onUserUpdate }) {
  const navigate = useNavigate();

  // Basic Info State
  const [basicInfo, setBasicInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    gender: user?.gender || "",
    phone: user?.phone || "",
    dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
    country: user?.address?.country || ""
  });
  const [isEditingBasic, setIsEditingBasic] = useState(false);

  // Address State
  const [address, setAddress] = useState({
    residentialAddress: user?.address?.residentialAddress || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || ""
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Education State
  const [education, setEducation] = useState(user?.education || []);
  const [isEditingEdu, setIsEditingEdu] = useState(false);

  // Internships State
  const [internships, setInternships] = useState(user?.internships || []);
  const [isEditingInt, setIsEditingInt] = useState(false);

  // Resume State
  const [resumeFileName, setResumeFileName] = useState(user?.resumeFileName || "");
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchFullProfile() {
      try {
        const res = await api.getProfile();
        const fullUser = res.user;
        if (fullUser) {
          setBasicInfo({
            firstName: fullUser.firstName || "",
            lastName: fullUser.lastName || "",
            email: fullUser.email || "",
            gender: fullUser.gender || "",
            phone: fullUser.phone || "",
            dob: fullUser.dob ? new Date(fullUser.dob).toISOString().split('T')[0] : "",
            country: fullUser.address?.country || ""
          });
          setAddress({
            residentialAddress: fullUser.address?.residentialAddress || "",
            city: fullUser.address?.city || "",
            state: fullUser.address?.state || "",
            pincode: fullUser.address?.pincode || ""
          });
          setEducation(fullUser.education || []);
          setInternships(fullUser.internships || []);
          setResumeFileName(fullUser.resumeFileName || "");
          if (onUserUpdate) onUserUpdate(fullUser);
        }
      } catch (err) {
        console.error("Failed to fetch full profile", err);
      }
    }
    fetchFullProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (section) => {
    setIsSaving(true);
    try {
      const updates = {};
      if (section === 'basic') {
        if (!basicInfo.firstName || !basicInfo.lastName || !basicInfo.gender || !basicInfo.dob || !basicInfo.phone || !basicInfo.country) {
          alert("Please fill all mandatory personal details (Name, Gender, DOB, Phone, Country).");
          setIsSaving(false);
          return;
        }

        const birthDate = new Date(basicInfo.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          alert("You must be at least 18 years old.");
          setIsSaving(false);
          return;
        }

        Object.assign(updates, {
          firstName: basicInfo.firstName,
          lastName: basicInfo.lastName,
          gender: basicInfo.gender,
          phone: basicInfo.phone,
          dob: basicInfo.dob,
          address: { ...address, country: basicInfo.country }
        });
      } else if (section === 'address') {
        if (!address.residentialAddress || !address.city || !address.state || !address.pincode) {
          alert("Please fill all mandatory address details.");
          setIsSaving(false);
          return;
        }
        Object.assign(updates, {
          address: { country: basicInfo.country, ...address }
        });
      } else if (section === 'education') {
        for (let edu of education) {
          if (!edu.institution || !edu.gradYear || !edu.score || !edu.degree) {
             alert("Please fill all mandatory education fields (Institution, Year, Score, Degree/Major).");
             setIsSaving(false);
             return;
          }
        }
        Object.assign(updates, { education });
      } else if (section === 'internships') {
        for (let int of internships) {
          if (!int.role || !int.company || !int.duration) {
             alert("Please fill all mandatory internship fields (Role, Company, Duration).");
             setIsSaving(false);
             return;
          }
        }
        Object.assign(updates, { internships });
      }

      const res = await api.updateProfile(updates);
      const fullUser = res.user;

      setBasicInfo({
        firstName: fullUser.firstName || "",
        lastName: fullUser.lastName || "",
        email: fullUser.email || "",
        gender: fullUser.gender || "",
        phone: fullUser.phone || "",
        dob: fullUser.dob ? new Date(fullUser.dob).toISOString().split('T')[0] : "",
        country: fullUser.address?.country || ""
      });
      setAddress({
        residentialAddress: fullUser.address?.residentialAddress || "",
        city: fullUser.address?.city || "",
        state: fullUser.address?.state || "",
        pincode: fullUser.address?.pincode || ""
      });
      setEducation(fullUser.education || []);
      setInternships(fullUser.internships || []);

      if (onUserUpdate) onUserUpdate(fullUser);

      if (section === 'basic') setIsEditingBasic(false);
      if (section === 'address') setIsEditingAddress(false);
      if (section === 'education') setIsEditingEdu(false);
      if (section === 'internships') setIsEditingInt(false);
      
    } catch (err) {
      alert("Failed to save changes: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploadingResume(true);
    try {
      const res = await api.uploadResume(file);
      setResumeFileName(res.user.resumeFileName);
      if (onUserUpdate) onUserUpdate(res.user);
      
      alert("Resume uploaded successfully! To see your updated ATS scores, please complete a new assessment.");
    } catch (err) {
      alert("Failed to upload resume: " + err.message);
    } finally {
      setIsUploadingResume(false);
      e.target.value = null; // Reset so the same file can be re-uploaded if needed
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await api.deleteProfile();
        onUserUpdate(null);
        window.localStorage.removeItem("skillbridge-token");
        window.localStorage.removeItem("skillbridge-user");
        navigate("/");
      } catch (err) {
        console.error(err);
        alert("Failed to delete account");
        setIsDeleting(false);
      }
    }
  };

  const inputClass = "w-full text-sm py-1.5 px-2 rounded border border-blue-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors";
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block";

  return (
    <div className="bg-[#f4f7f6] min-h-screen pt-20 pb-16 font-sans">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-[1200px] mx-auto px-6">
        
        {/* Page Header Tabs */}
        <motion.div variants={fadeUp} className="flex gap-8 border-b border-gray-200 mb-6">
          <button className="pb-3 text-sm font-semibold text-blue-700 border-b-2 border-blue-700">Personal info</button>
        </motion.div>

        <motion.h1 variants={fadeUp} className="text-2xl font-bold text-gray-900 mb-6">Personal info</motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Basic Information Card */}
          <motion.div variants={fadeUp} className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Basic information</h2>
              {!isEditingBasic ? (
                <button onClick={() => setIsEditingBasic(true)} className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                  <span className="material-symbols-outlined text-xl">edit</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditingBasic(false)} className="text-gray-500 hover:bg-gray-100 px-3 py-1 rounded text-sm font-medium transition-colors" disabled={isSaving}>Cancel</button>
                  <button onClick={() => handleSave('basic')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar and Name */}
              <div className="flex items-center gap-6 md:w-1/2">
                <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-4xl font-bold uppercase shrink-0 border-4 border-white shadow-sm">
                  {basicInfo.firstName?.charAt(0) || "U"}
                </div>
                <div className="flex-1 space-y-3">
                  <div className={`flex gap-2 text-gray-900 ${!isEditingBasic ? 'text-xl font-bold' : ''}`}>
                    {!isEditingBasic ? (
                      <span>{basicInfo.firstName} {basicInfo.lastName}</span>
                    ) : (
                      <>
                        <input className={inputClass} value={basicInfo.firstName} onChange={e => setBasicInfo({...basicInfo, firstName: e.target.value})} placeholder="First Name"/>
                        <input className={inputClass} value={basicInfo.lastName} onChange={e => setBasicInfo({...basicInfo, lastName: e.target.value})} placeholder="Last Name"/>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    <span>{basicInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="material-symbols-outlined text-sm">phone</span>
                    {!isEditingBasic ? (
                      <span>{basicInfo.phone || "No phone added"}</span>
                    ) : (
                      <input className={inputClass} value={basicInfo.phone} onChange={e => setBasicInfo({...basicInfo, phone: e.target.value})} placeholder="+1 234 567 890"/>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="material-symbols-outlined text-sm">person</span>
                    {!isEditingBasic ? (
                      <span>{basicInfo.gender || "No gender specified"}</span>
                    ) : (
                      <select className={inputClass} value={basicInfo.gender} onChange={e => setBasicInfo({...basicInfo, gender: e.target.value})}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Other Basic Details */}
              <div className="md:w-1/2 grid grid-cols-1 gap-4 pt-2 border-t md:border-t-0 md:border-l border-gray-100 md:pl-8">
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className={labelClass}>Birth date</span>
                  <div className="w-1/2">
                    {!isEditingBasic ? (
                      <span className="text-sm text-gray-700">{basicInfo.dob || "-"}</span>
                    ) : (
                      <input type="date" className={inputClass} value={basicInfo.dob} onChange={e => setBasicInfo({...basicInfo, dob: e.target.value})} />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className={labelClass}>Country</span>
                  <div className="w-1/2">
                    {!isEditingBasic ? (
                      <span className="text-sm text-gray-700 uppercase">
                        {basicInfo.country === "in" ? "India" : 
                         basicInfo.country === "us" ? "United States" : 
                         basicInfo.country === "uk" ? "United Kingdom" : 
                         basicInfo.country === "sg" ? "Singapore" : 
                         basicInfo.country === "de" ? "Germany" : 
                         basicInfo.country === "fr" ? "France" : 
                         basicInfo.country === "it" ? "Italy" : 
                         basicInfo.country || "-"}
                      </span>
                    ) : (
                      <select className={inputClass} value={basicInfo.country} onChange={e => {
                        const newCountry = e.target.value;
                        const code = COUNTRY_CODES[newCountry] || "";
                        let newPhone = basicInfo.phone || "";
                        let foundCode = false;
                        for (const c of Object.values(COUNTRY_CODES)) {
                          if (newPhone.startsWith(c + " ")) {
                            newPhone = newPhone.replace(c + " ", "");
                            foundCode = true;
                            break;
                          } else if (newPhone.startsWith(c)) {
                            newPhone = newPhone.replace(c, "");
                            foundCode = true;
                            break;
                          }
                        }
                        setBasicInfo({...basicInfo, country: newCountry, phone: code + " " + newPhone.trim()});
                        setAddress({...address, state: "", city: ""}); // clear address state/city when country changes
                      }}>
                        <option value="in">India</option>
                        <option value="us">United States</option>
                        <option value="uk">United Kingdom</option>
                        <option value="sg">Singapore</option>
                        <option value="de">Germany</option>
                        <option value="fr">France</option>
                        <option value="it">Italy</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Address Card */}
          <motion.div variants={fadeUp} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Address</h2>
              {!isEditingAddress ? (
                <button onClick={() => setIsEditingAddress(true)} className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                  <span className="material-symbols-outlined text-xl">edit</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditingAddress(false)} className="text-gray-500 hover:bg-gray-100 px-3 py-1 rounded text-sm font-medium transition-colors" disabled={isSaving}>Cancel</button>
                  <button onClick={() => handleSave('address')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50" disabled={isSaving}>
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <span className={labelClass}>Residential address</span>
                {!isEditingAddress ? (
                  <p className="text-sm text-gray-700">{address.residentialAddress || "-"}</p>
                ) : (
                  <textarea rows="2" className={`${inputClass} resize-none`} value={address.residentialAddress} onChange={e => setAddress({...address, residentialAddress: e.target.value})} />
                )}
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <span className={labelClass}>State</span>
                  {!isEditingAddress ? (
                    <span className="text-sm text-gray-700 capitalize">{address.state || "-"}</span>
                  ) : (
                    <select className={inputClass} value={address.state} onChange={e => setAddress({...address, state: e.target.value, city: ""})}>
                      <option value="">Select State</option>
                      {basicInfo.country && LOCATION_DATA[basicInfo.country] && Object.keys(LOCATION_DATA[basicInfo.country]).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <span className={labelClass}>City</span>
                  {!isEditingAddress ? (
                    <span className="text-sm text-gray-700 capitalize">{address.city || "-"}</span>
                  ) : (
                    <select className={inputClass} value={address.city} onChange={e => setAddress({...address, city: e.target.value})}>
                      <option value="">Select City</option>
                      {basicInfo.country && address.state && LOCATION_DATA[basicInfo.country]?.[address.state]?.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div>
                <span className={labelClass}>Pincode</span>
                {!isEditingAddress ? (
                  <span className="text-sm text-gray-700">{address.pincode || "-"}</span>
                ) : (
                  <input className={inputClass} value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                )}
              </div>
            </div>
          </motion.div>

          {/* Education Card */}
          <motion.div variants={fadeUp} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Education</h2>
              {!isEditingEdu ? (
                <button onClick={() => setIsEditingEdu(true)} className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                  <span className="material-symbols-outlined text-xl">edit</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { setEducation(user?.education || []); setIsEditingEdu(false); }} className="text-gray-500 hover:bg-gray-100 px-3 py-1 rounded text-sm font-medium transition-colors" disabled={isSaving}>Cancel</button>
                  <button onClick={() => handleSave('education')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50" disabled={isSaving}>
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {education.length === 0 && <p className="text-sm text-gray-500">No education details added.</p>}
              
              {(isEditingEdu ? education : sortEducation(education)).map((edu, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div className="absolute left-0 mt-1.5 w-4 h-4 rounded-full bg-gray-200 border-4 border-white shrink-0 z-10" />
                  <div className="ml-8 w-full">
                    {!isEditingEdu ? (
                      <>
                        <h3 className="font-semibold text-gray-900">{edu.level} - {edu.institution}</h3>
                        {edu.degree && <p className="text-sm text-gray-600 mt-0.5">{edu.degree}</p>}
                        <p className="text-sm text-gray-500 mt-1">Score: {edu.score}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{edu.gradYear}</p>
                      </>
                    ) : (
                      <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                        <div className="grid grid-cols-2 gap-2">
                          <input className={inputClass} value={edu.level} onChange={e => { const newEdu = [...education]; newEdu[idx].level = e.target.value; setEducation(newEdu); }} placeholder="Level" />
                          <input className={inputClass} value={edu.institution} onChange={e => { const newEdu = [...education]; newEdu[idx].institution = e.target.value; setEducation(newEdu); }} placeholder="Institution" />
                        </div>
                        <input className={inputClass} value={edu.degree} onChange={e => { const newEdu = [...education]; newEdu[idx].degree = e.target.value; setEducation(newEdu); }} placeholder="Degree / Major" />
                        <div className="grid grid-cols-2 gap-2">
                          <input className={inputClass} value={edu.score} onChange={e => { const newEdu = [...education]; newEdu[idx].score = e.target.value; setEducation(newEdu); }} placeholder="Score" />
                          <input className={inputClass} value={edu.gradYear} onChange={e => { const newEdu = [...education]; newEdu[idx].gradYear = e.target.value; setEducation(newEdu); }} placeholder="Grad Year" />
                        </div>
                        <button type="button" onClick={() => { const newEdu = [...education]; newEdu.splice(idx, 1); setEducation(newEdu); }} className="text-xs text-red-600 hover:underline">Remove</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isEditingEdu && (
                <button onClick={() => setEducation([...education, { level: "", institution: "", degree: "", score: "", gradYear: "" }])} className="ml-8 text-sm text-blue-600 font-medium hover:underline">+ Add Education</button>
              )}
            </div>
          </motion.div>

          {/* Internships Card */}
          <motion.div variants={fadeUp} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Internship Experience</h2>
              {!isEditingInt ? (
                <button onClick={() => setIsEditingInt(true)} className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                  <span className="material-symbols-outlined text-xl">edit</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { setInternships(user?.internships || []); setIsEditingInt(false); }} className="text-gray-500 hover:bg-gray-100 px-3 py-1 rounded text-sm font-medium transition-colors" disabled={isSaving}>Cancel</button>
                  <button onClick={() => handleSave('internships')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50" disabled={isSaving}>
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {internships.length === 0 && <p className="text-sm text-gray-500">No internships added.</p>}
              
              {internships.map((int, idx) => (
                <div key={idx} className={`p-4 rounded-lg ${!isEditingInt ? 'border border-gray-100' : 'bg-gray-50 border border-blue-100'} flex flex-col gap-2`}>
                  {!isEditingInt ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">{int.role}</span>
                        <span className="text-sm font-semibold text-gray-900">{int.company}</span>
                      </div>
                      <p className="text-xs text-gray-500">{int.duration} months</p>
                    </>
                  ) : (
                    <>
                      <input className={inputClass} value={int.role} onChange={e => { const newInt = [...internships]; newInt[idx].role = e.target.value; setInternships(newInt); }} placeholder="Role" />
                      <input className={inputClass} value={int.company} onChange={e => { const newInt = [...internships]; newInt[idx].company = e.target.value; setInternships(newInt); }} placeholder="Company" />
                      <input className={inputClass} value={int.duration} onChange={e => { const newInt = [...internships]; newInt[idx].duration = e.target.value; setInternships(newInt); }} placeholder="Duration" />
                      <div className="text-right">
                        <button type="button" onClick={() => { const newInt = [...internships]; newInt.splice(idx, 1); setInternships(newInt); }} className="text-xs text-red-600 hover:underline">Remove</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {isEditingInt && (
                <button onClick={() => setInternships([...internships, { role: "", company: "", duration: "" }])} className="text-sm text-blue-600 font-medium hover:underline">+ Add Internship</button>
              )}
            </div>
          </motion.div>

          {/* Resume Card */}
          <motion.div variants={fadeUp} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative md:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Resume</h2>
            </div>
            <div className="flex flex-col gap-4">
              {resumeFileName ? (
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <span className="material-symbols-outlined text-blue-600 text-2xl">description</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{resumeFileName}</p>
                    <p className="text-xs text-gray-500">Currently active resume</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No resume uploaded yet.</p>
              )}
              
              <div>
                <input 
                  type="file" 
                  id="resume-upload" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={isUploadingResume}
                />
                <label 
                  htmlFor="resume-upload" 
                  className={`inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md font-medium text-sm transition-colors cursor-pointer ${isUploadingResume ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  {isUploadingResume ? "Uploading..." : (resumeFileName ? "Upload New Resume" : "Upload Resume")}
                </label>
                <p className="text-xs text-gray-400 mt-2">Uploading a new resume will update it across all your target assessments.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Delete Account Section */}
        <motion.div variants={fadeUp} className="mt-12 flex justify-end">
          <button 
            onClick={handleDeleteAccount} 
            disabled={isDeleting}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-md font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
}
