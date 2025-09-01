import React, { useState } from 'react';
import { ArrowLeft, Image } from 'lucide-react';

interface MemberPageProps {
  member: {
    name: string;
    role: string;
    image: string;
    specialty: string;
    bio: string;
    skills: string[];
    joinDate: string;
    projects: string[];
    achievements: string[];
  };
  onBack: () => void;
}

export function MemberPage({ member, onBack }: MemberPageProps) {
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<number | null>(null);

  // Sample portfolio items for each member
  const portfolioItems = [
    {
      title: `${member.name}'s Featured Work #1`,
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/ghastbanner.png',
      description: `Amazing work showcasing ${member.role.toLowerCase()} expertise`,
      category: member.role
    },
    {
      title: `${member.name}'s Featured Work #2`,
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/ghastbanner.png',
      description: `Creative project demonstrating advanced ${member.role.toLowerCase()} skills`,
      category: member.role
    },
    {
      title: `${member.name}'s Featured Work #3`,
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/ghastbanner.png',
      description: `Professional showcase of ${member.role.toLowerCase()} capabilities`,
      category: member.role
    },
    {
      title: `${member.name}'s Featured Work #4`,
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/ghastbanner.png',
      description: `Latest project highlighting ${member.role.toLowerCase()} innovation`,
      category: member.role
    },
    {
      title: `${member.name}'s Featured Work #5`,
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/ghastbanner.png',
      description: `Collaborative work showing teamwork and ${member.role.toLowerCase()} mastery`,
      category: member.role
    },
    {
      title: `${member.name}'s Featured Work #6`,
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/ghastbanner.png',
      description: `Experimental project pushing ${member.role.toLowerCase()} boundaries`,
      category: member.role
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDaysWithTeam = (joinDate: string) => {
    const join = new Date(joinDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - join.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Team
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black" />
        <div className="absolute inset-0 bg-[url('https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/backgroundimage.png')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end gap-8">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-lg object-contain bg-zinc-800/50 p-2"
              />
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-zinc-700/50 text-zinc-300 rounded-full text-sm font-medium">
                    {member.specialty}
                  </span>
                  <span className="text-zinc-400">Joined {formatDate(member.joinDate)}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{member.name}</h1>
                <p className="text-xl text-zinc-300">{member.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            {/* Overview Section */}
            <section id="overview">
              <div className="bedrock-card p-8">
                <h2 className="text-3xl font-bold mb-6">Overview</h2>
                <p className="text-zinc-300 leading-relaxed mb-8 text-lg">{member.bio}</p>
                
                <h3 className="text-2xl font-bold mb-6">Skills & Expertise</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {member.skills.map((skill, index) => (
                    <div key={index} className="p-3 bg-zinc-800/50 rounded-lg">
                      <span className="text-zinc-300">{skill}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-2xl font-bold mb-6">Recent Projects</h3>
                <div className="space-y-4">
                  {member.projects.map((project, index) => (
                    <div key={index} className="p-4 bg-zinc-800/30 rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-white">{project}</h4>
                        <p className="text-sm text-zinc-400">Contributed as {member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1">{calculateDaysWithTeam(member.joinDate)}</div>
                    <div className="text-sm text-zinc-400">Days with Team</div>
                  </div>
                  <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1">{member.projects.length}</div>
                    <div className="text-sm text-zinc-400">Projects Completed</div>
                  </div>
                  <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1">{member.achievements.length}</div>
                    <div className="text-sm text-zinc-400">Achievements</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Portfolio Section */}
            <section id="portfolio">
              <div className="bedrock-card p-8">
                <h2 className="text-3xl font-bold mb-6">Portfolio</h2>
                <p className="text-zinc-400 mb-8">Showcase of {member.name}'s best work and contributions to Error 404 projects.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolioItems.map((item, index) => (
                    <div 
                      key={index}
                      className="relative overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-transform group"
                      onClick={() => setSelectedPortfolioItem(index)}
                    >
                      <img 
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-zinc-300">{item.category}</p>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <Image className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Achievements Section */}
            <section id="achievements">
              <div className="bedrock-card p-8">
                <h2 className="text-3xl font-bold mb-6">Achievements</h2>
                <p className="text-zinc-400 mb-8">Recognition and accomplishments earned by {member.name} during their time with Error 404.</p>
                
                <div className="space-y-6">
                  {member.achievements.map((achievement, index) => (
                    <div key={index} className="p-6 bg-zinc-800/30 rounded-lg">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-white mb-2">{achievement}</h4>
                        <p className="text-zinc-400 text-sm">
                          Earned through exceptional work in {member.role.toLowerCase()} and dedication to the Error 404 team.
                        </p>
                        <div className="text-sm text-zinc-500">Earned in 2024</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bedrock-card p-6">
              <h3 className="text-lg font-bold mb-4">Contact {member.name}</h3>
              <div className="space-y-3">
                <button className="bedrock-button w-full">
                  Send Message
                </button>
                <div className="text-center text-sm text-zinc-400">
                  Available for collaboration and project discussions
                </div>
              </div>
            </div>

            {/* Member Info */}
            <div className="bedrock-card p-6">
              <h3 className="text-lg font-bold mb-4">Member Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Role</span>
                  <span className="text-white">{member.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Team</span>
                  <span className="text-white">{member.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Joined</span>
                  <span className="text-white">{formatDate(member.joinDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Projects</span>
                  <span className="text-white">{member.projects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Specialties</span>
                  <span className="text-white">{member.skills.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="bedrock-card p-6">
              <h3 className="text-lg font-bold mb-4">Quick Navigation</h3>
              <div className="space-y-2">
                <a href="#overview" className="block text-zinc-300 hover:text-white transition-colors py-1">Overview</a>
                <a href="#portfolio" className="block text-zinc-300 hover:text-white transition-colors py-1">Portfolio</a>
                <a href="#achievements" className="block text-zinc-300 hover:text-white transition-colors py-1">Achievements</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Modal */}
      {selectedPortfolioItem !== null && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPortfolioItem(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={portfolioItems[selectedPortfolioItem].image}
              alt={portfolioItems[selectedPortfolioItem].title}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-xl font-bold text-white mb-2">
                {portfolioItems[selectedPortfolioItem].title}
              </h3>
              <p className="text-zinc-300">
                {portfolioItems[selectedPortfolioItem].description}
              </p>
            </div>
            <button
              onClick={() => setSelectedPortfolioItem(null)}
              className="absolute top-4 right-4 text-white text-3xl hover:text-zinc-300 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}