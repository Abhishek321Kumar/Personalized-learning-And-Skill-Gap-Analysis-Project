import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function RegistrationFlow({ onAuthSuccess }) {
  const [step, setStep] = useState(0); // 0: Create, 1: Part 1, 2: Part 2, 3: Verify
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  
  // Step 0: Account Form
  const [accountForm, setAccountForm] = useState({ fullName: "", email: "", password: "" });

  // Step 1: Part 1 Form
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [part1Form, setPart1Form] = useState({
    firstName: "", lastName: "", dob: "", email: "", phone: "", country: "in", residentialAddress: "", city: "", state: "", pincode: ""
  });

  // Step 2: Part 2 Form
  const [part2Form, setPart2Form] = useState({
    schoolInstitution: "", schoolYear: "", schoolGrade: "",
    ugDegree: "", ugUniversity: "", ugYear: "", ugCgpa: ""
  });

  // Step 3: OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [success, setSuccess] = useState(false);

  const handleAccountCreation = (e) => {
    e.preventDefault();
    setError("");
    if (accountForm.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUserId("user_123");
      setPart1Form({ ...part1Form, email: accountForm.email });
      setStep(1);
    }, 1000);
  };

  const handleResumeUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    
    setLoading(true);
    setTimeout(() => {
      setPart1Form({
        ...part1Form,
        firstName: accountForm.fullName.split(' ')[0] || "Aarav",
        lastName: accountForm.fullName.split(' ')[1] || "Sharma",
        phone: "+91 9876543210",
        city: "mumbai",
        state: "maharashtra",
        pincode: "400001",
        residentialAddress: "123 Tech Park"
      });
      setResumeUploaded(true);
      setLoading(false);
    }, 1500);
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!resumeUploaded) {
      setError("Please upload your resume first.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleNextStep2 = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1000);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setError("");
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otpCode === "000000") {
        setError("Invalid OTP.");
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        onAuthSuccess && onAuthSuccess({ id: userId, name: accountForm.fullName, email: accountForm.email });
        navigate("/assessments/setup");
      }, 2500);
    }, 1500);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="bg-[#f9f9f8] text-[#1a1c1c] font-sans min-h-screen flex flex-col pt-8 pb-16">
      <style>{`
        .label-accent { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: #71717a; display: inline-block; margin-bottom: 0.5rem; }
        .form-input { width: 100%; border: 1px solid #e5e7eb; border-radius: 0.375rem; padding: 0.75rem 1rem; font-size: 0.875rem; line-height: 1.25rem; color: #374151; background-color: #ffffff; }
        .form-input:focus { outline: none !important; border-color: #0052ff !important; box-shadow: 0 0 0 1px #0052ff !important; }
        .form-label { display: block; font-size: 0.875rem; font-weight: 500; color: #4b5563; margin-bottom: 0.5rem; }
        .form-label span.required { color: #ef4444; }
        
        .font-label-caps { font-family: 'Courier Prime', monospace; text-transform: uppercase; }
        .input-field { width: 100%; border: 1px solid #c3c5d9; padding: 12px 16px; font-family: 'Inter', sans-serif; font-size: 16px; background-color: transparent; transition: border-color 0.2s ease; }
        .input-field:focus { outline: none; border-color: #003ec7; }
        .input-label { display: block; font-family: 'Courier Prime', monospace; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #737688; margin-bottom: 8px; border-bottom: 1px solid #c3c5d9; padding-bottom: 4px; }
        .section-title { font-family: 'Inter', sans-serif; font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #1a1c1c; }
        .section-divider { height: 1px; background-color: #e2e2e2; margin: 32px 0; }
        
        .otp-input { text-align: center; font-size: 1.5rem; font-weight: bold; border: 1px solid #c3c5d9; border-radius: 0.25rem; }
        .otp-input:focus { border-color: #0052ff; outline: none; box-shadow: none; }
      `}</style>
      
      {/* Global Error Display */}
      {error && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-center shadow-lg">
            {error}
          </div>
        </div>
      )}

      {/* STEP 0: Create Account */}
      {step === 0 && (
        <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full pt-8">
          <section className="w-full md:w-1/2 md:pt-12 hidden md:block">
            <img alt="Abstract network graphic" className="w-full h-full object-cover rounded-lg min-h-[500px]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_c9tXE8qml19SzZXs3TZE4xOK2OltAg2LDvidO4dI93TVlaBINKFvCIBUwkkRx4NFlBdmjdX5c8I4iBRgv-dBBe2mpnmAO6kSS0jIBa4BzC5PGZkLdGmFYvEDpIt4qM6XjRncfMjaJnrfckXqlWQRTsRFOysz2u71z65HwhrMqOWxjv6GXzCJexyiuwHE1Yy6kVaLt23PZS-8w9xN59IoaEMjm9xk8mKPg5goBMC-CPgrLYHLp54UVDJV5wtfr0TV40YICz9Lfw" />
          </section>
          <section className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
            <div className="w-full max-w-[400px]">
              <span className="label-accent">Create Account</span>
              <h2 className="text-4xl font-light mt-2 mb-10">Start your readiness journey.</h2>
              <form className="space-y-6" onSubmit={handleAccountCreation}>
                <div>
                  <label className="label-accent block w-full" htmlFor="full_name">Full Name</label>
                  <input className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`} id="full_name" required type="text" value={accountForm.fullName} onChange={e => {setError(""); setAccountForm({...accountForm, fullName: e.target.value})}} />
                </div>
                <div>
                  <label className="label-accent block w-full" htmlFor="email">Email</label>
                  <input className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`} id="email" required type="email" value={accountForm.email} onChange={e => {setError(""); setAccountForm({...accountForm, email: e.target.value})}} />
                </div>
                <div>
                  <label className="label-accent block w-full" htmlFor="password">Password (Min 6)</label>
                  <input className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`} id="password" minLength="6" required type="password" value={accountForm.password} onChange={e => {setError(""); setAccountForm({...accountForm, password: e.target.value})}} />
                </div>
                <button className="w-full bg-blue-600 text-white py-4 font-medium flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50" type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create account →"}
                </button>
              </form>
              <div className="mt-8 text-sm text-gray-500">
                Have an account? <Link className="!text-[#0052FF] hover:underline" to="/login">Sign in</Link>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* STEP 1: Personal Information */}
      {step === 1 && (
        <main className="flex-grow mx-auto px-6 py-12 w-full max-w-7xl pt-16">
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="text-xs font-mono font-bold tracking-widest text-[#0052FF] uppercase mb-4">STEP 01</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Personal Information</h1>
            <div className="flex gap-2 w-full justify-center">
              <div className="h-1 w-24 bg-[#e2e2e2] rounded-full overflow-hidden"><div className="h-full w-full bg-[#0052ff]"></div></div>
              <div className="h-1 w-24 bg-[#e2e2e2] rounded-full"></div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleNextStep1}>
                <div className="mb-10">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-6">Resume Upload</h3>
                  <div className={`border-2 border-dashed rounded-lg p-8 text-center ${resumeUploaded ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-300'}`}>
                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">{resumeUploaded ? 'check_circle' : 'upload_file'}</span>
                    <p className="text-sm text-gray-700 font-medium mb-1">{resumeUploaded ? "Resume Parsed Successfully" : "Upload your resume to pre-fill your profile details."}</p>
                    <p className="text-xs text-gray-500 mb-6">PDF, DOCX or RTF (Max 5MB)</p>
                    <label className={`inline-block bg-white border border-gray-300 px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm cursor-pointer ${loading || resumeUploaded ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-50'}`}>
                      {loading ? "Parsing..." : resumeUploaded ? "File Selected" : "Select File"}
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx,.rtf" onChange={handleResumeUpload} disabled={loading || resumeUploaded} />
                    </label>
                  </div>
                </div>
                
                <div className={`mb-10 transition-opacity ${!resumeUploaded ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-6">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                    <div><label className="form-label">First Name<span className="required">*</span></label><input className={`form-input ${error && !part1Form.firstName ? 'border-red-500' : ''}`} placeholder="e.g. Aarav" required type="text" value={part1Form.firstName} onChange={e => setPart1Form({...part1Form, firstName: e.target.value})} disabled={!resumeUploaded} /></div>
                    <div><label className="form-label">Last Name<span className="required">*</span></label><input className={`form-input ${error && !part1Form.lastName ? 'border-red-500' : ''}`} placeholder="e.g. Sharma" required type="text" value={part1Form.lastName} onChange={e => setPart1Form({...part1Form, lastName: e.target.value})} disabled={!resumeUploaded} /></div>
                    <div><label className="form-label">Date of Birth</label><input className="form-input" type="date" value={part1Form.dob} onChange={e => setPart1Form({...part1Form, dob: e.target.value})} disabled={!resumeUploaded} /></div>
                    <div><label className="form-label">Email Address<span className="required">*</span></label><input className={`form-input ${error && !part1Form.email ? 'border-red-500' : ''}`} placeholder="aarav.s@skillbridge.edu" required type="email" value={part1Form.email} onChange={e => setPart1Form({...part1Form, email: e.target.value})} disabled={!resumeUploaded} /></div>
                    <div><label className="form-label">Phone Number<span className="required">*</span></label><input className={`form-input ${error && !part1Form.phone ? 'border-red-500' : ''}`} placeholder="+91 98765 43210" required type="tel" value={part1Form.phone} onChange={e => setPart1Form({...part1Form, phone: e.target.value})} disabled={!resumeUploaded} /></div>
                    <div>
                      <label className="form-label">Country</label>
                      <select className="form-input" value={part1Form.country} onChange={e => setPart1Form({...part1Form, country: e.target.value})} disabled={!resumeUploaded}>
                        <option value="in">India</option>
                        <option value="us">United States</option>
                        <option value="uk">United Kingdom</option>
                        <option value="sg">Singapore</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className={`mb-10 transition-opacity ${!resumeUploaded ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-6">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                    <div className="md:col-span-3"><label className="form-label">Residential Address<span className="required">*</span></label><input className={`form-input ${error && !part1Form.residentialAddress ? 'border-red-500' : ''}`} placeholder="House no, Building, Street name" required type="text" value={part1Form.residentialAddress} onChange={e => setPart1Form({...part1Form, residentialAddress: e.target.value})} disabled={!resumeUploaded} /></div>
                    <div>
                      <label className="form-label">City<span className="required">*</span></label>
                      <select className={`form-input ${error && !part1Form.city ? 'border-red-500' : ''}`} required value={part1Form.city} onChange={e => setPart1Form({...part1Form, city: e.target.value})} disabled={!resumeUploaded}>
                        <option value="">Select City</option><option value="mumbai">Mumbai</option><option value="bangalore">Bangalore</option><option value="delhi">Delhi</option><option value="hyderabad">Hyderabad</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">State<span className="required">*</span></label>
                      <select className={`form-input ${error && !part1Form.state ? 'border-red-500' : ''}`} required value={part1Form.state} onChange={e => setPart1Form({...part1Form, state: e.target.value})} disabled={!resumeUploaded}>
                        <option value="">Select State</option><option value="maharashtra">Maharashtra</option><option value="karnataka">Karnataka</option><option value="delhi">Delhi</option><option value="telangana">Telangana</option>
                      </select>
                    </div>
                    <div><label className="form-label">Pincode<span className="required">*</span></label><input className={`form-input ${error && !part1Form.pincode ? 'border-red-500' : ''}`} placeholder="400001" required type="text" value={part1Form.pincode} onChange={e => setPart1Form({...part1Form, pincode: e.target.value})} disabled={!resumeUploaded} /></div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between">
                  <p className="text-xs text-gray-500 mb-4 md:mb-0">
                    In order to process your registration, we ask you to provide the following information. Please note that all fields marked with an asterisk (*) are required.
                  </p>
                  <div className="flex space-x-4 shrink-0 md:ml-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors" type="button" onClick={() => setStep(0)}>CANCEL</button>
                    <button className="flex-1 md:flex-none flex items-center justify-center px-6 py-2.5 bg-[#0052FF] text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50" type="submit" disabled={!resumeUploaded || loading}>
                      NEXT <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      )}

      {/* STEP 2: Education & Internships */}
      {step === 2 && (
        <main className="flex-grow py-12 px-4 md:px-10 pt-16">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="text-center mb-12">
              <span className="font-label-caps text-[12px] text-[#737688] mb-4 inline-block tracking-widest text-[#003ec7]">STEP 02</span>
              <h1 className="font-headline-lg text-3xl md:text-[32px] text-[#1a1c1c]">Education & Internships</h1>
              <div className="flex justify-center gap-2 mt-8">
                <div className="h-1 w-24 bg-[#e2e2e2] rounded-full"></div>
                <div className="h-1 w-24 bg-[#e2e2e2] rounded-full overflow-hidden"><div className="h-full w-full bg-[#0052ff]"></div></div>
              </div>
            </div>
            
            <div className="bg-white border border-[#e2e2e2] p-8 shadow-sm">
              <form onSubmit={handleNextStep2}>
                {/* High School */}
                <div className="mb-10">
                  <h2 className="section-title">High School / Secondary Education<span className="text-red-600 ml-1">*</span></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="input-label">INSTITUTION NAME</label><input className={`input-field ${error && !part2Form.schoolInstitution ? 'border-red-500' : ''}`} placeholder="Enter school name" required type="text" value={part2Form.schoolInstitution} onChange={e => setPart2Form({...part2Form, schoolInstitution: e.target.value})} /></div>
                    <div><label className="input-label">YEAR OF COMPLETION</label><input className={`input-field ${error && !part2Form.schoolYear ? 'border-red-500' : ''}`} placeholder="YYYY" required type="text" value={part2Form.schoolYear} onChange={e => setPart2Form({...part2Form, schoolYear: e.target.value})} /></div>
                    <div><label className="input-label">GRADE / PERCENTAGE</label><input className={`input-field ${error && !part2Form.schoolGrade ? 'border-red-500' : ''}`} placeholder="Enter grade or percentage" required type="text" value={part2Form.schoolGrade} onChange={e => setPart2Form({...part2Form, schoolGrade: e.target.value})} /></div>
                  </div>
                </div>
                
                <div className="section-divider"></div>
                
                {/* Undergraduate */}
                <div className="mb-10">
                  <h2 className="section-title">Undergraduate Degree<span className="text-red-600 ml-1">*</span></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2"><label className="input-label">DEGREE / MAJOR</label><input className={`input-field ${error && !part2Form.ugDegree ? 'border-red-500' : ''}`} placeholder="e.g. Bachelor of Science in Computer Science" required type="text" value={part2Form.ugDegree} onChange={e => setPart2Form({...part2Form, ugDegree: e.target.value})} /></div>
                    <div><label className="input-label">UNIVERSITY NAME</label><input className={`input-field ${error && !part2Form.ugUniversity ? 'border-red-500' : ''}`} placeholder="Enter university name" required type="text" value={part2Form.ugUniversity} onChange={e => setPart2Form({...part2Form, ugUniversity: e.target.value})} /></div>
                    <div><label className="input-label">GRADUATION YEAR</label><input className={`input-field ${error && !part2Form.ugYear ? 'border-red-500' : ''}`} placeholder="YYYY" required type="text" value={part2Form.ugYear} onChange={e => setPart2Form({...part2Form, ugYear: e.target.value})} /></div>
                    <div><label className="input-label">CGPA / PERCENTAGE</label><input className={`input-field ${error && !part2Form.ugCgpa ? 'border-red-500' : ''}`} placeholder="Enter CGPA or percentage" required type="text" value={part2Form.ugCgpa} onChange={e => setPart2Form({...part2Form, ugCgpa: e.target.value})} /></div>
                  </div>
                </div>

                <div className="section-divider"></div>
                <div className="mb-10"><button type="button" className="flex items-center justify-between w-full text-left group"><h2 className="section-title mb-0">Postgraduate Degree</h2><span className="material-symbols-outlined text-[#003ec7] group-hover:opacity-80">add</span></button></div>
                <div className="section-divider"></div>
                <div className="mb-10"><button type="button" className="flex items-center justify-between w-full text-left group"><h2 className="section-title mb-0">PhD / Doctorate</h2><span className="material-symbols-outlined text-[#003ec7] group-hover:opacity-80">add</span></button></div>
                <div className="section-divider"></div>
                <div className="mb-10"><button type="button" className="flex items-center justify-between w-full text-left group"><div className="flex flex-col"><h2 className="section-title mb-0">Internship Experience</h2><p className="text-[16px] text-[#434656] mt-1">Add any relevant internships or projects to boost your profile.</p></div><span className="material-symbols-outlined text-[#003ec7] group-hover:opacity-80">add</span></button></div>
                
                <div className="mt-12 flex flex-col sm:flex-row justify-end gap-4">
                  <button className="text-[14px] font-medium px-6 py-3 border border-[#1a1c1c] text-[#1a1c1c] hover:bg-[#eeeeed] transition-colors w-full sm:w-auto text-center" type="button" onClick={() => setStep(1)}>BACK</button>
                  <button className="text-[14px] font-medium px-6 py-3 bg-[#0052ff] text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50" type="submit" disabled={loading}>
                    {loading ? "SUBMITTING..." : "SUBMIT"} <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      )}

      {/* STEP 3: Verify Email (OTP) */}
      {step === 3 && (
        <main className="flex-grow pt-32 pb-20 flex items-center justify-center px-4">
          <div className="w-full max-w-[560px] bg-white border border-[#c3c5d9] p-8 shadow-sm">
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-8">
                <div className="font-label-caps text-[12px] text-[#737688] mb-2 uppercase tracking-widest">Verification Step</div>
                <div className="w-full h-px bg-[#c3c5d9] mb-6"></div>
                <h1 className="text-[32px] font-medium mb-4 text-[#1a1c1c] font-sans">Verify Your Email</h1>
                <p className="text-[16px] text-[#434656]">We've sent a 6-digit OTP to your registered email address. Please enter it below to complete your registration.</p>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-6 gap-3">
                  {[0, 1, 2, 3, 4, 5].map(index => (
                    <input 
                      key={index}
                      id={`otp-${index}`}
                      className={`otp-input w-full h-16 ${error ? 'border-red-500 text-red-500' : 'border-[#c3c5d9]'}`}
                      maxLength="1" 
                      type="text"
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
                {error && <p className="text-red-600 text-sm text-center mt-4 font-medium">{error}</p>}
                <div className="text-center">
                  <p className="text-[16px] text-[#434656] mb-6">
                    Didn't receive the code? <button type="button" className="text-[#003ec7] font-bold hover:underline">Resend OTP</button>
                  </p>
                  <button className="w-full py-4 bg-[#003ec7] text-white text-[14px] font-medium flex justify-center items-center gap-2 group hover:opacity-90 transition-all disabled:opacity-50" type="submit" disabled={loading}>
                    {loading ? "VERIFYING..." : "Complete Registration"} <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      )}

      {/* Success Dialog Overlay */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white p-8 max-w-md w-full border border-[#c3c5d9] text-center shadow-lg">
              <div className="w-16 h-16 bg-[#0052ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[#0052ff] text-4xl" data-weight="fill">check_circle</span>
              </div>
              <h2 className="text-[32px] font-medium mb-2 font-sans">Registration Successful</h2>
              <p className="text-[16px] text-[#434656] mb-8">Welcome to SkillBridge! Your account has been verified. Redirecting you to the Assessment Setup...</p>
              <div className="w-full bg-[#eeeeed] h-1 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "linear" }} className="bg-[#003ec7] h-full"></motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
