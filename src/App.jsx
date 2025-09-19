import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipForward, SkipBack, Volume2, Users, Trophy, Target,
  Zap, Star, Award, Clock, BookOpen, Headphones, Settings,
  Plus, Check, X, MessageCircle, Send, Heart, Download,
  Home, ListTodo, Bot, User, Moon, Sun, ArrowRight,
  Gamepad2, Dumbbell, LogOut
} from 'lucide-react';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [darkMode, setDarkMode] = useState(true); // Defaulting to pitch dark mode
  const [user, setUser] = useState({
    name: '',
    age: '',
    goals: [],
    selectedCommunities: [],
    streak: 15,
    totalPoints: 2120,
    badges: ['Early Bird', 'Streak Master', 'Knowledge Seeker'],
    level: 3
  });

  const [audioPlayer, setAudioPlayer] = useState({
    isPlaying: false,
    isAudioLoading: false,
    currentTrack: null,
    progress: 0,
    currentTime: '0:00',
    totalTime: '0:00'
  });

  const [activeTab, setActiveTab] = useState('home');
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete React Hooks lesson', completed: false, points: 50 },
    { id: 2, text: 'Meditate for 10 minutes', completed: true, points: 30 },
    { id: 3, text: 'Listen to productivity podcast', completed: false, points: 40 }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsMenuRef = useRef(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);


  // AI Chatbot state
  const [aiChatMessages, setAiChatMessages] = useState([
    {
      id: 1,
      isUser: false,
      message: "Hi! I'm your AI learning assistant. I can help you with study questions, provide explanations, suggest learning paths, or just chat about your goals. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const aiChatRef = useRef(null);

  const audioSource = useRef(null);
  const animationFrameId = useRef(null);
  const progressBarRef = useRef(null);

  // Refs for all text inputs to fix the cursor focus issue
  const nameInputRef = useRef(null);
  const ageInputRef = useRef(null);
  const newTodoInputRef = useRef(null);
  const newMessageInputRef = useRef(null);
  const aiChatInputRef = useRef(null);

  // Sample data
  const goalOptions = [
    { id: 'coding', title: 'Learn to Code', icon: '💻', community: 'Coding Commuters' },
    { id: 'speaking', title: 'Improve Public Speaking', icon: '🎤', community: 'Speaker\'s Circle' },
    { id: 'mindfulness', title: 'Meditation & Mindfulness', icon: '🧘', community: 'Mindful Travelers' },
    { id: 'knowledge', title: 'General Knowledge', icon: '📚', community: 'Knowledge Seekers' },
    { id: 'business', title: 'Business Skills', icon: '💼', community: 'Business Builders' },
    { id: 'health', title: 'Health & Fitness', icon: '💪', community: 'Wellness Warriors' }
  ];

  const contentLibrary = {
    podcasts: [
      {
        id: 1,
        title: 'The Tech Talk Show',
        episode: 'Building Scalable React Apps',
        duration: '45:30',
        category: 'Technology',
        host: 'Sarah Chen',
        thumbnail: '🎙',
        description: 'Learn advanced React patterns and architecture. We will cover state management, custom hooks, and performance optimization techniques for large-scale applications.',
        type: 'long-form podcasts'
      },
      {
        id: 2,
        title: 'Mindful Mornings',
        episode: 'Starting Your Day with Intention',
        duration: '22:15',
        category: 'Wellness',
        host: 'Dr. Maya Patel',
        thumbnail: '🌅',
        description: 'Daily practices for mindful living. Discover how to set positive intentions for your day and create a routine that promotes focus, peace, and well-being.',
        type: 'long-form podcasts'
      },
      {
        id: 3,
        title: 'Daily Tech News',
        episode: 'The latest in AI',
        duration: '10:00',
        category: 'Technology',
        host: 'Alex Chen',
        thumbnail: '📰',
        description: 'A quick summary of the day\'s top technology news, focusing on the latest developments in AI and machine learning.',
        type: 'news summaries'
      },
      {
        id: 4,
        title: 'Brain Boosters',
        episode: 'Fun facts for a smart commute',
        duration: '8:45',
        category: 'General Knowledge',
        host: 'David Lee',
        thumbnail: '🧠',
        description: 'Engaging, bite-sized lessons on history, science, and more to keep your brain sharp.',
        type: 'short-form podcasts'
      }
    ],
    meditations: [
      {
        id: 1,
        title: 'Morning Commute Calm',
        duration: '8:00',
        category: 'Morning',
        type: 'meditation',
        thumbnail: '🌅',
        description: 'Start your day with peaceful breathing. This guided meditation will help you center your mind, reduce stress, and prepare for a productive day ahead, all while on the go.'
      },
      {
        id: 2,
        title: 'Stress Relief Express',
        duration: '5:30',
        category: 'Stress',
        type: 'meditation',
        thumbnail: '😌',
        description: 'A quick stress relief session for busy schedules. This short exercise uses progressive muscle relaxation and focused breathing to help you quickly unwind and find a moment of calm.'
      }
    ],
    learning: [
      {
        id: 1,
        title: 'JavaScript Fundamentals',
        duration: '15:22',
        category: 'Programming',
        level: 'Beginner',
        thumbnail: '⚡',
        description: 'Master the basics of JavaScript. This lesson will cover core concepts such as variables, data types, functions, and control structures to give you a solid foundation.',
        type: 'educational articles'
      },
      {
        id: 2,
        title: 'Public Speaking Confidence',
        duration: '18:45',
        category: 'Communication',
        level: 'Intermediate',
        thumbnail: '🎤',
        description: 'Build confidence for presentations. We will explore techniques for structuring your speech, engaging your audience, and managing nerves to deliver a memorable talk.',
        type: 'advanced topics'
      },
      {
        id: 3,
        title: 'Quantum Computing Explained',
        duration: '25:00',
        category: 'Technology',
        level: 'Expert',
        thumbnail: '⚛️',
        description: 'An in-depth look into the world of quantum computing, covering fundamental principles and potential applications.',
        type: 'advanced topics'
      },
      {
        id: 4,
        title: 'History of the Internet',
        duration: '12:00',
        category: 'History',
        level: 'Beginner',
        thumbnail: '🌐',
        description: 'A quick tour of the key milestones and figures that shaped the internet as we know it today.',
        type: 'educational articles'
      }
    ],
    childrensStories: [
      {
        id: 1,
        title: 'The Little Prince',
        duration: '30:00',
        category: 'Adventure',
        thumbnail: '👑',
        description: 'A classic tale of a young prince who travels the universe, learning about love, loss, and friendship.',
        type: 'childrens stories'
      },
      {
        id: 2,
        title: 'The Velveteen Rabbit',
        duration: '25:00',
        category: 'Fantasy',
        thumbnail: '🐰',
        description: 'The story of how a toy rabbit becomes real through the love of his owner.',
        type: 'childrens stories'
      }
    ],
    poems: [
      {
        id: 1,
        title: 'Where the Sidewalk Ends',
        duration: '4:00',
        category: 'Poetry',
        thumbnail: '📝',
        description: 'A collection of whimsical and thought-provoking poems by Shel Silverstein.',
        type: 'poems'
      },
      {
        id: 2,
        title: 'Leaves of Grass',
        duration: '10:00',
        category: 'Poetry',
        thumbnail: '📜',
        description: 'A selection of poems by Walt Whitman, celebrating nature, life, and the human spirit.',
        type: 'poems'
      }
    ]
  };

  const community = {
    name: 'Coding Commuters',
    members: 1247,
    avgStreak: 18,
    description: 'Learn programming on the go',
    dailyChallenge: 'Complete a 15-minute coding tutorial',
    leaderboard: [
      { name: 'Alex Chen', points: 2450, streak: 23, avatar: '👨‍💻' },
      { name: 'Sarah Kim', points: 2380, streak: 19, avatar: '👩‍🎓' },
      { name: 'You', points: 2120, streak: 15, avatar: '🚀' },
      { name: 'David Lee', points: 1980, streak: 12, avatar: '🧑‍🚀' },
      { name: 'Maria Garcia', points: 1850, streak: 10, avatar: '👩‍🔬' },
    ]
  };

  const quotes = [
    { quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
    { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
  ];

  const [dailyQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);


  // Close settings menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize sample community data
  useEffect(() => {
    if (user.goals.length > 0 && currentScreen !== 'onboarding') {
      setChatMessages([
        {
          id: 1,
          user: 'Alex Chen',
          message: 'Just finished the React Hooks lesson! Who else is working on it?',
          time: '10:30 AM',
          avatar: '👨‍💻'
        },
        {
          id: 2,
          user: 'Sarah Kim',
          message: 'Great job! I completed it yesterday. The useState examples were really helpful.',
          time: '10:32 AM',
          avatar: '👩‍🎓'
        }
      ]);
    }
  }, [user.goals, currentScreen]);

  // Auto scroll AI chat to bottom
  useEffect(() => {
    if (aiChatRef.current) {
      aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
    }
  }, [aiChatMessages]);

  // Keep focus on the new todo input
  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [newTodo]);

  // Keep focus on the community chat input
  useEffect(() => {
    if (newMessageInputRef.current) {
      newMessageInputRef.current.focus();
    }
  }, [newMessage]);

  // Keep focus on the AI chat input
  useEffect(() => {
    if (aiChatInputRef.current) {
      aiChatInputRef.current.focus();
    }
  }, [aiChatInput]);

  // Audio playback progress loop
  useEffect(() => {
    const updateProgress = () => {
        if (audioSource.current && !isNaN(audioSource.current.duration)) {
          const currentTime = audioSource.current.currentTime;
          const totalDuration = audioSource.current.duration;
          const progress = (currentTime / totalDuration) * 100;
          setAudioPlayer(prev => ({
            ...prev,
            progress: progress,
            currentTime: formatTime(currentTime),
            totalTime: formatTime(totalDuration)
          }));
        }
      animationFrameId.current = requestAnimationFrame(updateProgress);
    };

    if (audioPlayer.isPlaying) {
      animationFrameId.current = requestAnimationFrame(updateProgress);
    } else {
      cancelAnimationFrame(animationFrameId.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [audioPlayer.isPlaying]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Helper function to convert base64 to ArrayBuffer
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // Helper function to create a WAV file from PCM data
  const pcmToWav = (pcmData, sampleRate) => {
      const pcm16 = new Int16Array(pcmData);
      const buffer = new ArrayBuffer(44 + pcm16.length * 2);
      const view = new DataView(buffer);

      // RIFF identifier
      writeString(view, 0, 'RIFF');
      // file length
      view.setUint32(4, 36 + pcm16.length * 2, true);
      // RIFF type
      writeString(view, 8, 'WAVE');
      // format chunk identifier
      writeString(view, 12, 'fmt ');
      // format chunk length
      view.setUint32(16, 16, true);
      // sample format (1 = PCM)
      view.setUint16(20, 1, true);
      // channel count
      view.setUint16(22, 1, true);
      // sample rate
      view.setUint32(24, sampleRate, true);
      // byte rate (sample rate * channels * bytes per sample)
      view.setUint32(28, sampleRate * 1 * 2, true);
      // block align (channels * bytes per sample)
      view.setUint16(32, 1 * 2, true);
      // bits per sample
      view.setUint16(34, 16, true);
      // data chunk identifier
      writeString(view, 36, 'data');
      // data chunk length
      view.setUint32(40, pcm16.length * 2, true);

      // Write PCM data
      let offset = 44;
      for (let i = 0; i < pcm16.length; i++, offset += 2) {
          view.setInt16(offset, pcm16[i], true);
      }

      return new Blob([view], { type: 'audio/wav' });
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const playGeneratedAudio = async (text, voice, track) => {
    if (audioSource.current) {
      closeAudioPlayer();
    }

    setAudioPlayer(prev => ({...prev, isPlaying: false, isAudioLoading: true, currentTrack: track}));

    try {
        const payload = {
            contents: [{ parts: [{ text: text }] }],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voice }
                    }
                }
            },
            model: "gemini-2.5-flash-preview-tts"
        };

        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

        // Simulate a faster network response
        await new Promise(resolve => setTimeout(resolve, 500));

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        const part = result?.candidates?.[0]?.content?.parts?.[0];
        const audioData = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType;

        if (audioData && mimeType && mimeType.startsWith("audio/")) {
            const pcmData = base64ToArrayBuffer(audioData);
            const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)[1], 10);
            const pcm16 = new Int16Array(pcmData);
            const wavBlob = pcmToWav(pcm16, sampleRate);
            const audioUrl = URL.createObjectURL(wavBlob);

            const audio = new Audio(audioUrl);
            audio.onended = () => {
                setAudioPlayer(prev => ({ ...prev, isPlaying: false, progress: 100 }));
            };

            audio.play();
            audioSource.current = audio;

            setAudioPlayer(prev => ({
                ...prev,
                isPlaying: true,
                isAudioLoading: false,
                currentTrack: track,
                totalTime: '...',
                progress: 0,
                currentTime: '0:00'
            }));

        } else {
            console.error("No audio data received from API");
            setAudioPlayer(prev => ({...prev, isAudioLoading: false, currentTrack: null}));
        }
    } catch (error) {
        console.error("Error generating or playing audio:", error);
        setAudioPlayer(prev => ({...prev, isAudioLoading: false, currentTrack: null}));
    }
  };

  const playAudio = (track) => {
    let textToSpeak;
    let voice;
    if (track.type === 'podcast') {
      textToSpeak = `Hello, and welcome to the ${track.title}. In this episode, titled ${track.episode}, we will discuss ${track.description}.`;
      voice = 'Kore';
    } else if (track.type === 'meditation') {
      textToSpeak = `Welcome to your meditation session, ${track.title}. This will be an approximately ${track.duration} minute session focused on ${track.description}. Please find a comfortable position.`;
      voice = 'Puck';
    } else {
      textToSpeak = `Welcome to the lesson on ${track.title}. This is a ${track.level} level tutorial on ${track.description}.`;
      voice = 'Charon';
    }

    playGeneratedAudio(textToSpeak, voice, track);
  };

  const toggleAudio = () => {
    if (audioSource.current) {
      const isCurrentlyPlaying = audioPlayer.isPlaying;
      setAudioPlayer(prev => ({ ...prev, isPlaying: !isCurrentlyPlaying }));
      if (isCurrentlyPlaying) {
        audioSource.current.pause();
      } else {
        audioSource.current.play();
      }
    }
  };

  const closeAudioPlayer = () => {
    if (audioSource.current) {
      audioSource.current.pause();
      if (audioSource.current.src) {
        URL.revokeObjectURL(audioSource.current.src);
      }
      audioSource.current = null;
    }
    setAudioPlayer({
      isPlaying: false,
      isAudioLoading: false,
      currentTrack: null,
      progress: 0,
      currentTime: '0:00',
      totalTime: '0:00'
    });
  };

  const handleSeek = (e) => {
    if (!audioSource.current || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = (clickX / rect.width);
    audioSource.current.currentTime = audioSource.current.duration * progress;
  };

  // Todo functions
  const addTodo = (e) => {
    e?.preventDefault();
    if (newTodo.trim()) {
      const newTask = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        points: Math.floor(Math.random() * 50) + 20
      };
      setTodos([...todos, newTask]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo && !todo.completed) {
      setUser(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + todo.points
      }));
    }
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Chat functions
  const sendMessage = (e) => {
    e?.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: '🚀'
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  // AI Chat functions
  const sendAiMessage = async (e) => {
    e?.preventDefault();
    if (aiChatInput.trim()) {
      const userMessage = {
        id: Date.now(),
        isUser: true,
        message: aiChatInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setAiChatMessages(prev => [...prev, userMessage]);
      setAiChatInput('');
      setIsAiTyping(true);

      // Simulate AI response
      setTimeout(() => {
        const aiResponses = [
          "That's a great question! Based on your learning goals, I'd suggest starting with the fundamentals and building up gradually.",
          "I can help you create a personalized study plan. What specific topics are you most interested in?",
          "Here's what I recommend: Break down complex topics into smaller, manageable chunks that fit your commute time.",
          "Your progress looks good! Keep maintaining that streak. Consistency is key to effective learning.",
          "I notice you're interested in coding. Would you like some beginner-friendly coding exercises for your commute?",
          "Great mindset! Learning during commute time is an excellent way to maximize productivity.",
          "Based on your current level, I think you're ready to tackle some intermediate topics. Want some suggestions?"
        ];

        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

        const aiMessage = {
          id: Date.now() + 1,
          isUser: false,
          message: randomResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setAiChatMessages(prev => [...prev, aiMessage]);
        setIsAiTyping(false);
      }, 1500);
    }
  };

  const getAgeBasedContent = (age) => {
    const ageNum = parseInt(age, 10);
    if (ageNum < 10) {
      return ['poems', 'childrensStories'];
    } else if (ageNum >= 10 && ageNum <= 18) {
      return ['short-form podcasts', 'educational articles'];
    } else {
      return ['long-form podcasts', 'advanced topics', 'news summaries', 'meditations', 'podcasts', 'learning'];
    }
  };


  // Theme classes
  const themeClasses = {
    bg: darkMode ? 'bg-slate-900' : 'bg-slate-50',
    cardBg: darkMode ? 'bg-gray-800/60 backdrop-blur-lg' : 'bg-white/60 backdrop-blur-lg',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-300' : 'text-gray-600',
    border: darkMode ? 'border-gray-700/50' : 'border-gray-200',
    input: darkMode ? 'bg-gray-700/80 text-white border-gray-600' : 'bg-white/80 text-gray-900 border-gray-300',
    hover: darkMode ? 'hover:bg-gray-700/60' : 'hover:bg-gray-100/60'
  };

  // Onboarding Component
  const OnboardingScreen = () => {
    const [localName, setLocalName] = useState(user.name);
    const [localAge, setLocalAge] = useState(user.age);
    const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
    const logos = [
      <Headphones key="headphones" className="w-10 h-10 text-white" />,
      <Gamepad2 key="gamepad" className="w-10 h-10 text-white" />,
      <Dumbbell key="fitness" className="w-10 h-10 text-white" />,
      <Trophy key="sports" className="w-10 h-10 text-white" />,
      <BookOpen key="books" className="w-10 h-10 text-white" />,
      <Volume2 key="audio" className="w-10 h-10 text-white" />
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentLogoIndex(prevIndex => (prevIndex + 1) % logos.length);
      }, 2000);
      return () => clearInterval(interval);
    }, [logos.length]);


    const handleNextStep = () => {
      if (onboardingStep === 0) {
        setUser(prev => ({ ...prev, name: localName }));
      }
      if (onboardingStep === 2) {
        setUser(prev => ({ ...prev, age: localAge }));
      }
      if (onboardingStep < 3) {
        setOnboardingStep(onboardingStep + 1);
      } else {
        setCurrentScreen('dashboard');
      }
    };

    const handleGoalToggle = (goal) => {
      setUser(prev => ({
        ...prev,
        goals: prev.goals.find(g => g.id === goal.id)
          ? prev.goals.filter(g => g.id !== goal.id)
          : [...prev.goals, goal]
      }));
    };

    const handleCommunitySelect = (communityName) => {
      setUser(prev => ({
        ...prev,
        selectedCommunities: prev.selectedCommunities.includes(communityName)
          ? prev.selectedCommunities.filter(c => c !== communityName)
          : [...prev.selectedCommunities, communityName]
      }));
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 p-6 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <Target size={128} className="absolute -top-4 -left-4 text-white/10 animate-[spin_20s_linear_infinite]" />
        <Dumbbell size={150} className="absolute top-1/4 -right-10 text-white/10 animate-[gentle-float_8s_ease-in-out_infinite]" />
        <Headphones size={140} className="absolute bottom-4 -left-8 text-white/10 animate-[gentle-float-reverse_10s_ease-in-out_infinite]" />
        <Zap size={100} className="absolute top-1/3 left-1/4 text-yellow-300/10 animate-[gentle-float_7s_ease-in-out_infinite_1s]" />
        <Star size={110} className="absolute bottom-1/4 right-1/4 text-white/10 animate-[gentle-float-reverse_9s_ease-in-out_infinite_2s]" />
        <Award size={130} className="absolute top-2/3 right-1/2 text-white/10 animate-[gentle-float_12s_ease-in-out_infinite_3s]" />
        <Heart size={90} className="absolute top-1/2 left-1/3 text-red-400/10 animate-[gentle-float_6s_ease-in-out_infinite_4s]" />

        <span className="absolute top-[20%] left-[10%] text-white/10 text-lg font-semibold animate-[gentle-float_8s_ease-in-out_infinite_2s]">Learn</span>
        <span className="absolute top-[30%] right-[15%] text-white/10 text-lg font-semibold animate-[gentle-float-reverse_9s_ease-in-out_infinite_1s]">Grow</span>
        <span className="absolute bottom-[25%] left-[20%] text-white/10 text-lg font-semibold animate-[gentle-float_10s_ease-in-out_infinite]">Focus</span>
        <span className="absolute bottom-[15%] right-[10%] text-white/10 text-lg font-semibold animate-[gentle-float-reverse_7s_ease-in-out_infinite_3s]">Achieve</span>


        <div className="max-w-md w-full mx-auto z-10">
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {[0, 1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= onboardingStep ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {onboardingStep === 0 && (
            <>
              <div className="text-center mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center relative overflow-hidden">
                    {logos.map((logo, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${
                          currentLogoIndex === index ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        {logo}
                      </div>
                    ))}
                  </div>
                <h1 className="text-3xl font-bold text-white mb-2">FlowMate</h1>
                <p className="text-blue-200">Achieve your goals with focus and flow</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 text-center">
                <h2 className="text-xl font-semibold text-white mb-2">Welcome!</h2>
                <p className="text-blue-200 mb-4">Let's personalize your learning journey</p>
                <input
                  type="text"
                  ref={nameInputRef}
                  placeholder="Enter your name"
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-blue-200 border-none outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </>
          )}

          {onboardingStep === 1 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Choose Your Goals</h1>
                <p className="text-blue-200">Select what you want to learn or improve</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  {goalOptions.map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal)}
                      className={`p-4 rounded-xl text-left transition-all transform hover:scale-105 cursor-pointer ${
                        user.goals.find(g => g.id === goal.id)
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-white/10 text-blue-100 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-2xl mb-2">{goal.icon}</div>
                      <div className="text-sm font-medium">{goal.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {onboardingStep === 2 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">How old are you?</h1>
                <p className="text-blue-200">This helps us recommend the best content for you.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 text-center">
                <input
                  type="number"
                  ref={ageInputRef}
                  placeholder="Enter your age"
                  value={localAge}
                  onChange={(e) => setLocalAge(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-blue-200 border-none outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </>
          )}

          {onboardingStep === 3 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Join Communities</h1>
                <p className="text-blue-200">Connect with people who share your goals</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <div className="space-y-4">
                  {user.goals.map(goal => (
                    <div
                      key={goal.id}
                      className="bg-white/10 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/20"
                      onClick={() => handleCommunitySelect(goal.community)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{goal.icon}</div>
                          <div>
                            <h3 className="font-semibold text-white">{goal.community}</h3>
                            <p className="text-sm text-blue-200">Based on: {goal.title}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          user.selectedCommunities.includes(goal.community)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-white/50'
                        }`}>
                          {user.selectedCommunities.includes(goal.community) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleNextStep}
            disabled={
              (onboardingStep === 0 && !localName.trim()) ||
              (onboardingStep === 1 && user.goals.length === 0) ||
              (onboardingStep === 2 && !localAge) ||
              (onboardingStep === 3 && user.selectedCommunities.length === 0)
            }
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
          >
            {onboardingStep === 3 ? 'Start Learning!' : 'Continue'}
          </button>
        </div>
      </div>
    );
  };

  // Audio Player Component
  const AudioPlayer = () => {
    if (!audioPlayer.currentTrack) return null;

    return (
      <div className={`fixed bottom-20 left-4 right-4 ${themeClasses.cardBg} rounded-2xl shadow-lg p-4 z-50 transition-all duration-300`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 mr-4">
            <h4 className={`font-semibold text-sm truncate ${themeClasses.text} transition-colors duration-300`}>{audioPlayer.currentTrack.title}</h4>
            <p className={`text-xs ${themeClasses.textSecondary} transition-colors duration-300`}>{audioPlayer.currentTrack.host || audioPlayer.currentTrack.category}</p>
          </div>
          <button onClick={closeAudioPlayer} className={`${themeClasses.hover} p-2 rounded-full`}>
            <X className={`w-6 h-6 ${themeClasses.text}`} />
          </button>
        </div>

        {audioPlayer.isAudioLoading ? (
            <div className="flex items-center justify-center p-4 opacity-100 transition-opacity duration-300">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
              <span className={`text-sm ml-3 ${themeClasses.textSecondary}`}>Generating audio...</span>
            </div>
        ) : (
            <>
            <div className="flex items-center justify-between mb-1 opacity-100 transition-opacity duration-300">
                <div className={`text-xs ${themeClasses.textSecondary} transition-colors duration-300`}>
                {audioPlayer.currentTime}
                </div>
                <div className={`text-xs ${themeClasses.textSecondary} transition-colors duration-300`}>
                {audioPlayer.totalTime}
                </div>
            </div>
            <div
                ref={progressBarRef}
                className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1 mb-4 cursor-pointer`}
                onMouseDown={handleSeek}
            >
                <div
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${audioPlayer.progress}%` }}
                />
            </div>
            </>
        )}

        <div className="flex items-center justify-center space-x-6">
          <button disabled={audioPlayer.isAudioLoading} className={`p-2 rounded-full ${audioPlayer.isAudioLoading ? 'opacity-50 cursor-not-allowed' : themeClasses.hover}`}>
            <SkipBack className={`w-5 h-5 ${themeClasses.textSecondary} transition-colors duration-300`} />
          </button>
          <button
            onClick={toggleAudio}
            disabled={audioPlayer.isAudioLoading}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {audioPlayer.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button disabled={audioPlayer.isAudioLoading} className={`p-2 rounded-full ${audioPlayer.isAudioLoading ? 'opacity-50 cursor-not-allowed' : themeClasses.hover}`}>
            <SkipForward className={`w-5 h-5 ${themeClasses.textSecondary} transition-colors duration-300`} />
          </button>
        </div>
      </div>
    );
  };

  // Content Library Component
  const ContentLibrary = () => {
    const categories = ['all', 'podcasts', 'meditations', 'learning', 'childrensStories', 'poems'];

    const getFilteredContent = () => {
      const ageBasedContentTypes = getAgeBasedContent(user.age);
      const allContent = [
          ...contentLibrary.podcasts.map(item => ({ ...item, type: 'podcasts' })),
          ...contentLibrary.meditations.map(item => ({ ...item, type: 'meditations' })),
          ...contentLibrary.learning.map(item => ({ ...item, type: 'learning' })),
          ...contentLibrary.childrensStories.map(item => ({ ...item, type: 'childrensStories' })),
          ...contentLibrary.poems.map(item => ({ ...item, type: 'poems' })),
      ];

      if (selectedCategory === 'all') {
        return allContent.filter(item => ageBasedContentTypes.includes(item.type) || (item.type === 'learning' && ageBasedContentTypes.includes('advanced topics')) || (item.type === 'podcasts' && ageBasedContentTypes.includes('long-form podcasts')) || (item.type === 'podcasts' && ageBasedContentTypes.includes('short-form podcasts')) || (item.type === 'podcasts' && ageBasedContentTypes.includes('news summaries')));
      }

      return allContent.filter(item => item.type === selectedCategory);
    };

    return (
      <div className="p-6">
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {getFilteredContent().map(item => (
            <div
              key={`${item.type}-${item.id}`}
              className={`${themeClasses.cardBg} rounded-xl p-4 border ${themeClasses.border} hover:shadow-md transition-all cursor-pointer`}
              onClick={() => playAudio(item)}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{item.thumbnail}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${themeClasses.text} transition-colors duration-300`}>{item.title}</h3>
                    <span className={`text-sm ${themeClasses.textSecondary} transition-colors duration-300`}>{item.duration}</span>
                  </div>
                  <p className={`text-sm ${themeClasses.textSecondary} mb-2 transition-colors duration-300`}>{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.level
                        ? 'bg-purple-100 text-purple-800'
                        : item.type === 'podcasts'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {item.level || item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                    <Play className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Home Dashboard Component
  const HomeDashboard = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${themeClasses.text} transition-colors duration-300`}>Welcome back, {user.name}!</h1>
          <p className={`text-sm ${themeClasses.textSecondary} transition-colors duration-300`}>Your learning journey continues.</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-xl flex items-center space-x-2 ${themeClasses.cardBg} transition-colors duration-300`}>
            <Clock className="w-5 h-5 text-blue-500" />
            <span className={`font-semibold ${themeClasses.text} transition-colors duration-300`}>{user.streak}</span>
          </div>
          <div className={`p-2 rounded-xl flex items-center space-x-2 ${themeClasses.cardBg} transition-colors duration-300`}>
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className={`font-semibold ${themeClasses.text} transition-colors duration-300`}>{user.totalPoints}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-2xl ${themeClasses.cardBg} border ${themeClasses.border} transition-colors duration-300`}>
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-5 h-5 text-purple-500" />
            <h3 className={`font-semibold ${themeClasses.text} transition-colors duration-300`}>Your Level</h3>
            <div className={`text-2xl font-bold ${themeClasses.text} transition-colors duration-300`}>{user.level}</div>
            <p className={`text-sm ${themeClasses.textSecondary} transition-colors duration-300`}>Knowledge Seeker</p>
          </div>
        </div>
        <div className={`p-4 rounded-2xl ${themeClasses.cardBg} border ${themeClasses.border} transition-colors duration-300`}>
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-5 h-5 text-green-500" />
            <h3 className={`font-semibold ${themeClasses.text} transition-colors duration-300`}>Badges</h3>
          </div>
          <div className="flex flex-wrap gap-1">
            {user.badges.map((badge, index) => (
              <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">{badge}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-2xl ${themeClasses.cardBg} border ${themeClasses.border} mb-6 text-center`}>
          <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className={`italic ${themeClasses.text}`}>"{dailyQuote.quote}"</p>
          <p className={`text-sm mt-2 font-semibold ${themeClasses.textSecondary}`}>- {dailyQuote.author}</p>
      </div>

      <h2 className={`text-xl font-bold mb-4 ${themeClasses.text} transition-colors duration-300`}>Daily Goal</h2>
      <div className={`p-4 rounded-2xl flex items-center justify-between ${themeClasses.cardBg} border ${themeClasses.border} mb-6 transition-colors duration-300`}>
        <div className="flex items-center space-x-4">
          <Target className="w-6 h-6 text-blue-500" />
          <div>
            <h3 className={`font-semibold ${themeClasses.text} transition-colors duration-300`}>Listen to one lesson</h3>
            <p className={`text-sm ${themeClasses.textSecondary} transition-colors duration-300`}>Today's challenge</p>
          </div>
        </div>
        <button onClick={() => setActiveTab('learn')} className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors">Go</button>
      </div>

      <h2 className={`text-xl font-bold mb-4 ${themeClasses.text} transition-colors duration-300`}>Your Communities</h2>
      <div className="space-y-4">
        {user.selectedCommunities.map((communityName, index) => (
          <div key={index} className={`p-4 rounded-2xl ${themeClasses.cardBg} border ${themeClasses.border} flex items-center justify-between transition-colors duration-300`}>
            <div className="flex items-center space-x-4">
              <Users className="w-6 h-6 text-orange-500" />
              <div>
                <h3 className={`font-semibold ${themeClasses.text} transition-colors duration-300`}>{communityName}</h3>
                <p className={`text-sm ${themeClasses.textSecondary} transition-colors duration-300`}>Connecting with others</p>
              </div>
            </div>
            <button onClick={() => setActiveTab('community')} className={`text-blue-500 font-semibold text-sm ${themeClasses.hover} px-3 py-1 rounded-full`}>View</button>
          </div>
        ))}
      </div>
    </div>
  );

  // Todo List Component
  const TodoList = () => (
    <div className="p-6">
      <h2 className={`text-2xl font-bold mb-4 ${themeClasses.text} transition-colors duration-300`}>To-Do List</h2>
      <form onSubmit={addTodo} className="flex space-x-2 mb-4">
        <input
          type="text"
          ref={newTodoInputRef}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className={`flex-1 p-3 rounded-xl outline-none ${themeClasses.input} transition-colors duration-300`}
        />
        <button type="submit" className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors">
          <Plus className="w-6 h-6" />
        </button>
      </form>
      <div className="space-y-3">
        {todos.map(todo => (
          <div key={todo.id} className={`flex items-center justify-between p-4 rounded-2xl border ${themeClasses.cardBg} ${themeClasses.border} transition-colors duration-300 ${
            todo.completed ? 'opacity-60' : ''
          }`}>
            <div className="flex items-center space-x-4 flex-1">
              <button onClick={() => toggleTodo(todo.id)} className="flex-shrink-0">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  todo.completed ? 'bg-blue-500 border-blue-500' : themeClasses.border
                }`}>
                  {todo.completed && <Check className="w-4 h-4 text-white" />}
                </div>
              </button>
              <span className={`flex-1 ${themeClasses.text} transition-colors duration-300 ${todo.completed ? 'line-through' : ''}`}>
                {todo.text}
              </span>
              <span className="text-sm font-bold text-yellow-500">+{todo.points} pts</span>
            </div>
            <button onClick={() => deleteTodo(todo.id)} className={`text-sm text-red-500 hover:text-red-700 transition-colors p-2 rounded-full ${themeClasses.hover}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // AI Chatbot Component
  const AIChatbot = () => (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-2xl font-bold ${themeClasses.text} transition-colors duration-300`}>Your AI Assistant</h2>
      </div>

      <div ref={aiChatRef} className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2 mb-4">
        {aiChatMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-xl max-w-[80%] transition-colors duration-300 ${
              msg.isUser ? 'bg-blue-500 text-white' : `${themeClasses.cardBg} ${themeClasses.text}`
            }`}>
              <p>{msg.message}</p>
              <span className={`block mt-1 text-xs text-right transition-colors duration-300 ${msg.isUser ? 'text-blue-200' : themeClasses.textSecondary}`}>{msg.timestamp}</span>
            </div>
          </div>
        ))}
        {isAiTyping && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-xl ${themeClasses.cardBg} ${themeClasses.text} transition-colors duration-300`}>
              <div className="flex space-x-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendAiMessage} className="flex space-x-2">
        <input
          type="text"
          ref={aiChatInputRef}
          value={aiChatInput}
          onChange={(e) => setAiChatInput(e.target.value)}
          placeholder="Ask me anything..."
          className={`flex-1 p-3 rounded-xl outline-none ${themeClasses.input} transition-colors duration-300`}
        />
        <button type="submit" className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors">
          <Send className="w-6 h-6" />
        </button>
      </form>
    </div>
  );

  // Community Chat Component
  const CommunityChat = () => (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={`text-2xl font-bold ${themeClasses.text} transition-colors duration-300`}>{community.name}</h2>
          <p className={`text-sm ${themeClasses.textSecondary} transition-colors duration-300`}>{community.members} Members</p>
        </div>
        <button onClick={() => setIsLeaderboardOpen(true)} className={`text-blue-500 font-semibold text-sm ${themeClasses.hover} px-3 py-1 rounded-full`}>View Leaderboard</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2 mb-4">
        {chatMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 ${msg.user === 'You' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xl">{msg.avatar}</div>
              <div className={`p-3 rounded-xl max-w-[80%] transition-colors duration-300 ${
                msg.user === 'You' ? 'bg-blue-500 text-white' : `${themeClasses.cardBg} ${themeClasses.text}`
              }`}>
                <div className={`flex items-center justify-between mb-1 ${msg.user === 'You' ? 'flex-row-reverse' : ''}`}>
                  <span className={`font-semibold text-xs transition-colors duration-300 ${msg.user === 'You' ? 'text-blue-200' : themeClasses.textSecondary}`}>{msg.user}</span>
                  <span className={`text-xs transition-colors duration-300 ${msg.user === 'You' ? 'text-blue-200' : themeClasses.textSecondary}`}>{msg.time}</span>
                </div>
                <p>{msg.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex space-x-2">
        <input
          type="text"
          ref={newMessageInputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className={`flex-1 p-3 rounded-xl outline-none ${themeClasses.input} transition-colors duration-300`}
        />
        <button type="submit" className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors">
          <Send className="w-6 h-6" />
        </button>
      </form>
    </div>
  );

  const InteractiveBackground = ({ darkMode }) => {
    const backgroundRef = useRef(null);

    useEffect(() => {
      const handleMouseMove = (e) => {
        if (!backgroundRef.current) return;
        const { clientX, clientY } = e;
        const x = clientX / window.innerWidth * 100;
        const y = clientY / window.innerHeight * 100;

        const lightColor = 'rgba(147, 197, 253, 0.3)';
        const darkColor = 'rgba(59, 130, 246, 0.4)';

        const color = darkMode ? darkColor : lightColor;

        backgroundRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, ${color}, transparent 40%)`;
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, [darkMode]);

    return <div ref={backgroundRef} className="absolute inset-0 -z-10 transition-colors duration-1000" />;
  };

  const LeaderboardModal = ({ isOpen, onClose }) => {
    const sortedLeaderboard = [...community.leaderboard].sort((a, b) => b.points - a.points);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
        <div className={`w-full max-w-md h-[80%] ${themeClasses.cardBg} rounded-t-3xl p-6 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Leaderboard</h2>
            <button onClick={onClose} className={`${themeClasses.hover} p-2 rounded-full`}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="overflow-y-auto space-y-3">
            {sortedLeaderboard.map((player, index) => (
              <div key={player.name} className={`flex items-center p-3 rounded-xl ${player.name === 'You' ? (darkMode ? 'bg-blue-900/50' : 'bg-blue-100') : ''}`}>
                <div className="w-10 text-center text-lg font-bold">{index + 1}</div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-3">{player.avatar}</div>
                <div className="flex-1">
                  <p className={`font-semibold ${themeClasses.text}`}>{player.name}</p>
                  <div className="flex items-center space-x-4 text-sm mt-1">
                    <span className="flex items-center"><Trophy className="w-4 h-4 mr-1 text-yellow-500" /> {player.points}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-blue-500" /> {player.streak} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };


  // Main App Content
  const MainApp = () => {
    const renderContent = () => {
      switch (activeTab) {
        case 'home':
          return <HomeDashboard />;
        case 'learn':
          return <ContentLibrary />;
        case 'todos':
          return <TodoList />;
        case 'community':
          return <CommunityChat />;
        case 'ai':
          return <AIChatbot />;
        default:
          return <HomeDashboard />;
      }
    };

    return (
      <div className={`min-h-screen flex flex-col ${themeClasses.bg} ${themeClasses.text} transition-colors duration-300 relative overflow-hidden`}>
        <InteractiveBackground darkMode={darkMode} />
        <Target size={128} className={`absolute -top-4 -left-4 ${darkMode ? 'text-white/5' : 'text-gray-900/5'} animate-[spin_20s_linear_infinite]`} />
        <Dumbbell size={150} className={`absolute top-1/4 -right-10 ${darkMode ? 'text-white/5' : 'text-gray-900/5'} animate-[gentle-float_8s_ease-in-out_infinite]`} />
        <Headphones size={140} className={`absolute bottom-4 -left-8 ${darkMode ? 'text-white/5' : 'text-gray-900/5'} animate-[gentle-float-reverse_10s_ease-in-out_infinite]`} />
        <Zap size={100} className={`absolute top-1/3 left-1/4 ${darkMode ? 'text-yellow-300/10' : 'text-yellow-500/10'} animate-[gentle-float_7s_ease-in-out_infinite_1s]`} />
        <Star size={110} className={`absolute bottom-1/4 right-1/4 ${darkMode ? 'text-white/10' : 'text-gray-900/10'} animate-[gentle-float-reverse_9s_ease-in-out_infinite_2s]`} />
        <Award size={130} className={`absolute top-2/3 right-1/2 ${darkMode ? 'text-white/10' : 'text-gray-900/10'} animate-[gentle-float_12s_ease-in-out_infinite_3s]`} />
        <Heart size={90} className={`absolute top-1/2 left-1/3 ${darkMode ? 'text-red-400/10' : 'text-red-500/10'} animate-[gentle-float_6s_ease-in-out_infinite_4s]`} />


        <LeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
        <div className="max-w-md mx-auto relative pb-20 min-h-screen flex flex-col w-full z-10">
          {/* Header */}
          <div className={`flex justify-between items-center p-6 ${themeClasses.cardBg} border-b ${themeClasses.border} sticky top-0 z-10 transition-colors duration-300`}>
            <button onClick={() => setActiveTab('home')}>
              <Headphones className={`w-8 h-8 ${themeClasses.text} transition-colors duration-300`} />
            </button>
            <div className="flex items-center space-x-4">
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full ${themeClasses.hover}`}>
                {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-indigo-900" />}
              </button>
              <div className="relative" ref={settingsMenuRef}>
                <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`p-2 rounded-full ${themeClasses.hover}`}>
                  <Settings className={`w-6 h-6 ${themeClasses.text} transition-colors duration-300`} />
                </button>
                {isSettingsOpen && (
                  <div className={`absolute right-0 mt-2 w-48 ${themeClasses.cardBg} rounded-lg shadow-xl z-20 border ${themeClasses.border} transition-colors duration-300`}>
                    <div className="py-1">
                      <a href="#" className={`flex items-center px-4 py-2 text-sm ${themeClasses.text} ${themeClasses.hover} transition-colors duration-300`}>
                        <User className="w-4 h-4 mr-3" />
                        My Profile
                      </a>
                      <a href="#" className={`flex items-center px-4 py-2 text-sm ${themeClasses.text} ${themeClasses.hover} transition-colors duration-300`}>
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>

          {/* Audio Player */}
          {audioPlayer.currentTrack && <AudioPlayer />}

          {/* Bottom Nav */}
          <div className={`fixed bottom-0 left-0 right-0 ${themeClasses.cardBg} border-t ${themeClasses.border} shadow-lg z-40 transition-colors duration-300`}>
              <div className="flex justify-around items-center h-16 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${activeTab === 'home' ? 'text-blue-500' : themeClasses.textSecondary}`}
              >
                <Home className="w-6 h-6" />
                <span className="text-xs">Home</span>
              </button>
              <button
                onClick={() => setActiveTab('learn')}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${activeTab === 'learn' ? 'text-blue-500' : themeClasses.textSecondary}`}
              >
                <BookOpen className="w-6 h-6" />
                <span className="text-xs">Learn</span>
              </button>
                <button
                onClick={() => setIsLeaderboardOpen(true)}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${isLeaderboardOpen ? 'text-blue-500' : themeClasses.textSecondary}`}
              >
                <Trophy className="w-6 h-6" />
                <span className="text-xs">Rank</span>
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${activeTab === 'community' ? 'text-blue-500' : themeClasses.textSecondary}`}
              >
                <Users className="w-6 h-6" />
                <span className="text-xs">Community</span>
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${activeTab === 'ai' ? 'text-blue-500' : themeClasses.textSecondary}`}
              >
                <Bot className="w-6 h-6" />
                <span className="text-xs">AI</span>
              </button>
              </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes gentle-float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
        @keyframes gentle-float-reverse {
            0% { transform: translateY(0px); }
            50% { transform: translateY(20px); }
            100% { transform: translateY(0px); }
        }
      `}</style>
      <script src="https://cdn.tailwindcss.com"></script>
      {currentScreen === 'onboarding' ? <OnboardingScreen /> : <MainApp />}
    </>
  );
};

export default App;
