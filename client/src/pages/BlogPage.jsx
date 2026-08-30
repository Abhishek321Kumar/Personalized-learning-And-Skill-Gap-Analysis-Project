import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: 1,
    title: "How AI and NLP are Revolutionizing Resume Parsing",
    summary: "Discover how SkillBridge uses advanced Natural Language Processing to accurately extract skills from your resume, eliminating the manual data entry grind and matching you with jobs faster.",
    content: "Resume parsing has always been a pain point for both applicants and recruiters. In the past, simplistic keyword matching led to highly inaccurate candidate profiles. Today, utilizing Large Language Models (LLMs) and advanced Natural Language Processing (NLP) pipelines, we can map unstructured resume data directly to structured, industry-standard skill ontologies.\n\nAt SkillBridge, our AI engine understands context. If you write 'built backend services using Express', it knows you possess 'Node.js' and 'API Development' skills. This semantic understanding ensures that your Skill Gap Analysis is built on an incredibly accurate foundation, matching you with the right job roles without requiring you to manually check hundreds of skill boxes.",
    category: "AI & NLP",
    author: "Dr. Sarah Chen",
    date: "Aug 15, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800",
    featured: true,
    trending: true,
    skillTags: ["NLP", "Machine Learning", "Python", "Data Parsing"],
    difficulty: "Intermediate",
    relatedRoles: ["Data Scientist", "Backend Developer"],
    keyTakeaways: [
      "Semantic NLP eliminates tedious manual resume data entry.",
      "Context-aware models map implicit skills to standardized ontologies.",
      "High-accuracy parsing is the bedrock of effective Skill Gap Analysis."
    ],
    linkedQuizId: "setup" // using /assessments/setup as mock destination
  },
  {
    id: 2,
    title: "The Anatomy of a Skill Gap Analysis",
    summary: "What exactly is a skill gap? Learn how mapping your current proficiencies against target Job Descriptions can provide a definitive roadmap for your career.",
    content: "A skill gap analysis is the process of comparing your current skill set with the requirements of your target job role. While it sounds simple in theory, doing this at scale requires sophisticated data structures.\n\nBy continuously comparing your evolving profile to real-time Job Descriptions, you can identify exactly what you need to learn next. This shifts your career growth from 'guessing' to 'executing a data-driven plan'.",
    category: "Skill Gap Analysis",
    author: "Marcus Johnson",
    date: "Aug 10, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    skillTags: ["Career Planning", "Data Analysis", "Self-Assessment"],
    difficulty: "Beginner",
    relatedRoles: ["Product Manager", "Software Engineer", "UX Designer"],
    keyTakeaways: [
      "Skill gaps represent the delta between current capability and market demand.",
      "Data-driven analysis provides objective baselines compared to self-evaluation.",
      "Automated matching engines dramatically speed up career pivoting."
    ],
    linkedQuizId: "setup"
  },
  {
    id: 3,
    title: "Personalized Learning: Moving Beyond the Generic Syllabus",
    summary: "Why one-size-fits-all education is failing modern professionals, and how dynamic learning roadmaps can accelerate your upskilling journey.",
    content: "Traditional education forces everyone through the same syllabus, regardless of their starting point. This leads to boredom for advanced learners and frustration for novices.\n\nAdaptive learning pathways fundamentally change this dynamic. By utilizing continuous assessments to update your skill profile in real-time, personalized systems ensure you only spend time learning the specific concepts you haven't mastered yet.",
    category: "Personalized Learning",
    author: "Elena Rodriguez",
    date: "Aug 05, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
    trending: true,
    skillTags: ["EdTech", "Adaptive Learning", "Instructional Design"],
    difficulty: "Beginner",
    relatedRoles: ["Educator", "Corporate Trainer"],
    keyTakeaways: [
      "Generic syllabi are highly inefficient for professional upskilling.",
      "Personalized learning isolates and targets specific weak points.",
      "Dynamic roadmaps adapt instantaneously as you validate new skills."
    ],
    linkedQuizId: null
  },
  {
    id: 4,
    title: "Building Adaptive Quizzes with React and Node.js",
    summary: "A technical deep dive into how we built SkillBridge's timed assessment engine that adjusts question difficulty based on real-time user performance.",
    content: "When building our assessment engine, we needed a system that could evaluate answers and adjust difficulty within milliseconds to maintain the user's flow state.\n\nWe utilized React on the frontend for crisp, stateful UI transitions, and an Express.js backend to evaluate question logic. By implementing a customized difficulty curve algorithm, the assessment rapidly homes in on the user's true proficiency level.",
    category: "React & Node.js",
    author: "Alex Wong",
    date: "Jul 28, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    skillTags: ["React", "Node.js", "Express", "System Design"],
    difficulty: "Advanced",
    relatedRoles: ["Fullstack Developer", "Frontend Developer"],
    keyTakeaways: [
      "Adaptive testing requires low-latency, dynamic evaluations.",
      "React state gracefully manages timers and UI changes.",
      "Server-side validation is crucial to prevent cheating on timed assessments."
    ],
    linkedQuizId: "setup"
  },
  {
    id: 5,
    title: "Aligning Tech with Purpose: SkillBridge and SDG 4",
    summary: "Exploring our commitment to the UN's Sustainable Development Goal 4. Learn how we're democratizing quality education through measurable digital skill validation.",
    content: "The UN's Sustainable Development Goal 4 aims to ensure inclusive and equitable quality education and promote lifelong learning opportunities for all. \n\nSkillBridge is directly aligned with Target 4.4: increasing the number of youth and adults who have relevant skills for employment and decent jobs. By providing transparent readiness scores and accessible assessments, we're helping build a global framework for digital skill validation.",
    category: "SDG 4",
    author: "Dr. Sarah Chen",
    date: "Jul 20, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    skillTags: ["Sustainability", "Global Goals", "Digital Skills"],
    difficulty: "Beginner",
    relatedRoles: ["All Roles", "Policy Maker"],
    keyTakeaways: [
      "Technology platforms are critical for scaling quality education globally.",
      "Skill validation is a fundamental metric for tracking SDG 4.4 progress.",
      "Empowering individuals with transparent digital skills drives economic growth."
    ],
    linkedQuizId: null
  },
  {
    id: 6,
    title: "Nailing the Technical Interview in 2026",
    summary: "Using your SkillBridge readiness score to identify blind spots before you ever step into an interview room.",
    content: "Technical interviews remain one of the highest barriers to entry in the modern workforce. However, walking into an interview without knowing your exact weaknesses is an avoidable mistake.\n\nBy leveraging your SkillBridge readiness score and running through adaptive quizzes prior to the interview, you can identify the specific concepts the interviewer is most likely to drill you on.",
    category: "Career & Job Readiness",
    author: "Marcus Johnson",
    date: "Jul 12, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
    trending: true,
    skillTags: ["Interview Prep", "Communication", "Problem Solving"],
    difficulty: "Intermediate",
    relatedRoles: ["Software Engineer", "Data Scientist"],
    keyTakeaways: [
      "Knowing your technical weaknesses is a superpower in interviews.",
      "Adaptive mock assessments build immense confidence under pressure.",
      "Readiness scores provide an objective baseline to track improvement over time."
    ],
    linkedQuizId: "setup"
  },
  {
    id: 7,
    title: "Next-Gen Adaptive Quizzes",
    summary: "Learn how the latest research in adaptive testing is changing how we evaluate digital skills.",
    content: "Computerized Adaptive Testing (CAT) leverages Item Response Theory to dynamically select questions based on the examinee's ability. This means if you answer correctly, the next question is harder; if you fail, it gets easier.\n\nThis approach drastically reduces quiz fatigue by ensuring users aren't bogged down by overly simple questions, nor demoralized by impossibly difficult ones.",
    category: "Adaptive Quizzes",
    author: "Elena Rodriguez",
    date: "Jul 05, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    skillTags: ["Testing Theory", "Algorithms", "Assessment Design"],
    difficulty: "Advanced",
    relatedRoles: ["Data Scientist", "Backend Developer"],
    keyTakeaways: [
      "Adaptive testing requires a massive, properly calibrated question bank.",
      "It yields higher precision proficiency estimates using fewer questions.",
      "User experience is maximized when question difficulty remains near the edge of their ability."
    ],
    linkedQuizId: null
  }
];

const CATEGORIES = ["All", "AI & NLP", "Skill Gap Analysis", "Personalized Learning", "Adaptive Quizzes", "React & Node.js", "Career & Job Readiness", "SDG 4"];

// --- Mock AI Assistant Hook ---
function useAIAssistant() {
  const [messages, setMessages] = useState([{ role: "ai", text: "Hi! I'm your AI Reading Assistant. Ask me anything about this article or how it applies to your skills." }]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text) => {
    setMessages(prev => [...prev, { role: "user", text }]);
    setIsTyping(true);
    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: `That's a great question about "${text}". Based on this article and SkillBridge's methodology, the key is to apply this concept directly to your skill gap analysis. Let me know if you want to explore the technical details further!` }]);
      setIsTyping(false);
    }, 1500);
  };

  return { messages, sendMessage, isTyping, reset: () => setMessages([{ role: "ai", text: "Hi! I'm your AI Reading Assistant. Ask me anything about this article or how it applies to your skills." }]) };
}

export function BlogPage({ user }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Progress & Tracking State (Persisted in LocalStorage)
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(window.localStorage.getItem('sb-blog-bookmarks') || '[]'));
  const [completed, setCompleted] = useState(() => JSON.parse(window.localStorage.getItem('sb-blog-completed') || '[]'));
  
  // UI State
  const [activeArticle, setActiveArticle] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [chatInput, setChatInput] = useState("");
  
  const aiAssistant = useAIAssistant();
  const chatBottomRef = useRef(null);

  // Sync state to local storage
  useEffect(() => { window.localStorage.setItem('sb-blog-bookmarks', JSON.stringify(bookmarks)); }, [bookmarks]);
  useEffect(() => { window.localStorage.setItem('sb-blog-completed', JSON.stringify(completed)); }, [completed]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isChatOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiAssistant.messages, isChatOpen]);

  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const toggleCompleted = (e, id) => {
    e.stopPropagation();
    setCompleted(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const openArticle = (article) => {
    setActiveArticle(article);
    setIsSummarizing(true);
    setIsChatOpen(false);
    aiAssistant.reset();
    document.body.style.overflow = 'hidden'; // prevent background scrolling
    
    // Simulate AI generation time for summary
    setTimeout(() => setIsSummarizing(false), 1200);
  };

  const closeArticle = () => {
    setActiveArticle(null);
    document.body.style.overflow = 'unset';
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    aiAssistant.sendMessage(chatInput);
    setChatInput("");
  };

  // --- Derived Data ---
  
  // Semantic Search Mock (Just standard filter for now, but UI looks like AI)
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = post.title.toLowerCase().includes(query) || 
                            post.summary.toLowerCase().includes(query) ||
                            post.skillTags.some(tag => tag.toLowerCase().includes(query));
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const trendingPosts = BLOG_POSTS.filter(p => p.trending);
  
  // Mock personalization: if user is logged in, show advanced tech topics or skill gap related
  const recommendedPosts = user ? BLOG_POSTS.filter(p => p.difficulty === "Advanced" || p.category.includes("Skill")) : [];

  const featuredPost = BLOG_POSTS.find(post => post.featured);
  
  const displayPosts = (searchQuery === "" && selectedCategory === "All") 
    ? filteredPosts.filter(post => !post.featured)
    : filteredPosts;

  // --- Components ---

  const ArticleCard = ({ post, layout = 'vertical' }) => (
    <div 
      onClick={() => openArticle(post)}
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex cursor-pointer ${layout === 'horizontal' ? 'flex-col md:flex-row md:h-44 w-full' : 'flex-col hover:-translate-y-1'}`}
    >
      <div className={`overflow-hidden relative shrink-0 ${layout === 'horizontal' ? 'w-full h-48 md:h-auto md:w-[200px]' : 'h-52 w-full'}`}>
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0052FF] bg-white/95 backdrop-blur-sm shadow-sm px-2.5 py-1 rounded-full w-max">
            {post.category}
          </span>
          {completed.includes(post.id) && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 shadow-sm px-2.5 py-1 rounded-full flex items-center gap-1 w-max">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              Completed
            </span>
          )}
        </div>
      </div>
      
      <div className={`p-5 flex flex-col flex-1 min-w-0 ${layout === 'horizontal' ? 'justify-center' : ''}`}>
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-3">
          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
            {post.difficulty}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {post.readTime}
          </span>
        </div>
        
        <h3 className={`font-bold text-slate-900 group-hover:text-[#0052FF] transition-colors line-clamp-2 leading-tight ${layout === 'horizontal' ? 'text-lg mb-2' : 'text-xl mb-3'}`}>
          {post.title}
        </h3>
        
        {layout !== 'horizontal' && (
          <p className="text-slate-600 text-sm mb-5 line-clamp-3 leading-relaxed flex-grow">
            {post.summary}
          </p>
        )}
        
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200">
              {post.author.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-slate-700">{post.author}</span>
          </div>
          
          <button 
            onClick={(e) => toggleBookmark(e, post.id)}
            className="text-slate-300 hover:text-[#0052FF] transition-colors p-1"
          >
            <svg className={`w-5 h-5 ${bookmarks.includes(post.id) ? 'fill-[#0052FF] text-[#0052FF]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-8 pb-20 w-full relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        
        {/* Header & AI Semantic Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Skill<span className="text-[#0052FF]">Bridge</span> Blogs
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              AI-powered insights, tutorials, and career advice tailored to close your skill gaps.
            </p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <svg className="h-5 w-5 text-indigo-500 group-focus-within:animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pr-10 py-3.5 border-2 border-indigo-100 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm transition-all duration-300 shadow-sm relative z-0"
              style={{ paddingLeft: '3rem' }}
              placeholder="Search a blog"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category 
                  ? "bg-slate-900 text-white shadow-md scale-105" 
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-sm hover:scale-105"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Personalized & Trending Carousels (Only show when no search/filter) */}
        {searchQuery === "" && selectedCategory === "All" && (
          <div className="space-y-12">
            
            {/* AI Personalized Recommendation Row */}
            {user && recommendedPosts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <h2 className="text-xl font-bold text-slate-900">Recommended for Your Skill Gaps</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recommendedPosts.map(post => (
                    <ArticleCard key={post.id} post={post} layout="horizontal" />
                  ))}
                </div>
              </div>
            )}

            {/* Trending Row */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
                <h2 className="text-xl font-bold text-slate-900">Trending Now</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {trendingPosts.map(post => (
                  <ArticleCard key={post.id} post={post} layout="horizontal" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 pt-4">
          <h2 className="text-xl font-bold text-slate-900">
            {searchQuery ? 'Search Results' : (selectedCategory !== 'All' ? `${selectedCategory} Articles` : 'All Articles')}
          </h2>
          <span className="text-sm font-medium text-slate-500">{displayPosts.length} Results</span>
        </div>

        {/* Regular Posts Grid */}
        {displayPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.map(post => (
              <ArticleCard key={post.id} post={post} layout="vertical" />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No articles found</h3>
            <p className="text-slate-500 text-lg">Try adjusting your AI semantic search or category filters.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="mt-8 px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* --- Full Page Article Overlay with AI Tools --- */}
      {activeArticle && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex justify-end">
          {/* Overlay background click to close */}
          <div className="absolute inset-0" onClick={closeArticle}></div>
          
          {/* Main Overlay Panel */}
          <div className="w-full md:w-[85%] lg:w-[75%] xl:w-[65%] bg-white h-full shadow-2xl relative flex flex-col transform transition-transform duration-300 animate-slide-in-right overflow-hidden">
            
            {/* Top Toolbar */}
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 shrink-0 bg-white z-10">
              <div className="flex items-center gap-4">
                <button onClick={closeArticle} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0052FF] bg-blue-50 px-3 py-1 rounded-full">
                    {activeArticle.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {activeArticle.difficulty}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => toggleBookmark(e, activeArticle.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${bookmarks.includes(activeArticle.id) ? 'bg-blue-50 text-[#0052FF]' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <svg className={`w-4 h-4 ${bookmarks.includes(activeArticle.id) ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  {bookmarks.includes(activeArticle.id) ? 'Saved' : 'Save'}
                </button>
                <button 
                  onClick={(e) => toggleCompleted(e, activeArticle.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${completed.includes(activeArticle.id) ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  {completed.includes(activeArticle.id) ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto flex">
              {/* Left Column (Article) */}
              <div className={`flex-1 p-8 lg:p-12 transition-all duration-300 ${isChatOpen ? 'lg:pr-8 border-r border-slate-100' : ''}`}>
                <div className="max-w-3xl mx-auto">
                  <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    {activeArticle.title}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-10 pb-10 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg border border-slate-200">
                      {activeArticle.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">{activeArticle.author}</p>
                      <div className="flex items-center text-sm font-medium text-slate-500 gap-3">
                        <span>{activeArticle.date}</span>
                        <span>•</span>
                        <span>{activeArticle.readTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Summarizer Box */}
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      <h3 className="text-lg font-bold text-slate-900">✨ AI Key Takeaways</h3>
                    </div>
                    {isSummarizing ? (
                      <div className="space-y-3 animate-pulse">
                        <div className="h-4 bg-indigo-100 rounded w-3/4"></div>
                        <div className="h-4 bg-indigo-100 rounded w-full"></div>
                        <div className="h-4 bg-indigo-100 rounded w-5/6"></div>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {activeArticle.keyTakeaways.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Body */}
                  <div className="prose prose-lg prose-slate max-w-none mb-12">
                    {activeArticle.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-slate-700 text-lg leading-relaxed mb-6">{paragraph}</p>
                    ))}
                  </div>

                  {/* Integration: Quiz / Roadmap */}
                  {activeArticle.linkedQuizId && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center mt-12 mb-12">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Test Your Knowledge</h3>
                      <p className="text-slate-600 mb-6">Ready to see where you stand? Take a quick SkillBridge assessment related to this topic.</p>
                      <button 
                        onClick={() => navigate('/assessments/setup')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0052FF] text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                      >
                        Start Adaptive Quiz
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </button>
                    </div>
                  )}

                  {/* Tags & Metadata */}
                  <div className="border-t border-slate-100 pt-8 mt-12">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Skill Tags</h4>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {activeArticle.skillTags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Related Job Roles</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeArticle.relatedRoles.map(role => (
                        <span key={role} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-md">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-24"></div> {/* Spacer */}
                </div>
              </div>

              {/* Right Column (AI Chat Assistant) */}
              {isChatOpen && (
                <div className="w-80 lg:w-96 bg-slate-50 flex flex-col shrink-0 animate-fade-in border-l border-slate-200 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)]">
                  <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      </div>
                      <span className="font-bold text-slate-900">AI Assistant</span>
                    </div>
                    <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {aiAssistant.messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-[#0052FF] text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {aiAssistant.isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1">
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>
                  
                  {/* Chat Input */}
                  <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                    <form onSubmit={handleChatSubmit} className="relative">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about this article..." 
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                      />
                      <button 
                        type="submit"
                        disabled={!chatInput.trim() || aiAssistant.isTyping}
                        className="absolute right-2 top-2 p-1.5 bg-indigo-500 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Floating FAB to open chat if closed */}
            {!isChatOpen && (
              <button 
                onClick={() => setIsChatOpen(true)}
                className="absolute bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform animate-bounce-slow z-50"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Add some required custom CSS for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
