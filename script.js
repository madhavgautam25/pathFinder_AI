// Form data object
const formData = {
  skills: '',
  interests: '',
  preference: '',
  team: '',
  industries: '',
  softSkills: ''
};

// Selected options tracker
const selectedOptions = {
  preference: null,
  team: null
};

// OpenAI API integration
const getCareerRecommendations = async (data) => {
  const openai = new OpenAI({
    apiKey: 'YOUR_API_KEY', // Replace with your actual API key
    dangerouslyAllowBrowser: true // Only for frontend demos
  });

  try {
    const prompt = `Based on these student details:
    Skills: ${data.skills}
    Interests: ${data.interests}
    Work Preference: ${data.preference}
    Team Preference: ${data.team}
    Industries: ${data.industries}
    Soft Skills: ${data.softSkills}

    Please provide:
    1. 2-3 suitable career paths with explanations
    2. 3 recommended courses (include platform names)
    3. 2 project ideas they can build
    4. List of free learning resources
    
    Format as JSON with these keys: careerPaths, courses, projects, resources`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const recommendations = JSON.parse(response.choices[0].message.content);
    careerPaths: [
      {
        title: "Full Stack Developer",
        description: `With your skills in ${data.skills || 'technology'} and interest in ${data.interests || 'digital solutions'}, this role allows you to work on both front-end and back-end development. Great for ${careerFocus}.`
      },
      {
        title: "Data Scientist",
        description: `Your potential for ${data.preference === 'logical' ? 'logical problem-solving' : 'creative data visualization'} makes this a strong option. Combines ${data.interests || 'analysis'} with technical skills.`
      },
      {
        title: "UX/UI Designer",
        description: `Perfect blend for ${data.preference === 'creative' ? 'creativity' : 'systematic thinking'} applied to user experiences. Your ${data.softSkills || 'soft skills'} would be valuable here.`
      }
    ],
    courses [
      {
        title: "Introduction to Computer Science",
        platform: "edX (Harvard CS50)",
        link: "https://www.edx.org/course/cs50s-introduction-to-computer-science",
        free: true
      },
      {
        title: "The Web Developer Bootcamp 2023",
        platform: "Udemy",
        link: "https://www.udemy.com/course/the-web-developer-bootcamp/",
        free: false
      },
      {
        title: "Machine Learning Crash Course",
        platform: "Google Developers",
        link: "https://developers.google.com/machine-learning/crash-course",
        free: true
      }
    ],
    projects [
      {
        title: "Build a Personal Portfolio Website",
        description: "Showcase your skills and projects in a responsive website using HTML, CSS, and JavaScript."
      },
      {
        title: "Create a Small Data Analysis Project",
        description: `Analyze ${data.interests ? data.interests.toLowerCase() : 'a topic'} you're interested in using Python and visualize the results.`
      }
    ],
    resources [
      {
        title: "freeCodeCamp",
        description: "Free coding challenges and projects",
        link: "https://www.freecodecamp.org/"
      },
      {
        title: "DEV Community",
        description: "Software developers sharing knowledge",
        link: "https://dev.to/"
      },
      {
        title: "GitHub Student Pack",
        description: "Free tools and services for students",
        link: "https://education.github.com/pack"
      }
    ]
  } catch{}

  // Customize based on industries mentioned
  if (data.industries.toLowerCase().includes('health')) {
    recommendations.careerPaths.push({
      title: "Health Technology Specialist",
      description: "Combine healthcare knowledge with technology skills to improve medical systems and patient care."
    });
    recommendations.courses.push({
      title: "Health Informatics on Coursera",
      platform: "Coursera",
      link: "https://www.coursera.org/learn/health-informatics",
      free: true
    });
  }

  if (data.industries.toLowerCase().includes('fin')) {
    recommendations.careerPaths.push({
      title: "Fintech Developer",
      description: "Work at the intersection of finance and technology to create innovative financial solutions."
    });
  }

  return recommendations;
};

// DOM Navigation Functions
function showStep(stepNumber) {
  document.querySelectorAll('.question-step').forEach(step => {
    step.classList.add('hidden');
  });
  document.getElementById(`step-${stepNumber}`).classList.remove('hidden');
}

function nextStep(currentStep) {
  // Validate and store current step data
  if (currentStep === 1) {
    formData.skills = document.getElementById('skills').value;
    if (!formData.skills) {
      alert('Please tell us about your skills');
      return;
    }
  } else if (currentStep === 2) {
    formData.interests = document.getElementById('interests').value;
    if (!formData.interests) {
      alert('Please share your interests');
      return;
    }
  } else if (currentStep === 5) {
    formData.industries = document.getElementById('industries').value;
  } else if (currentStep === 6) {
    formData.softSkills = document.getElementById('softSkills').value;
  }

  if (currentStep < 6) {
    showStep(currentStep + 1);
  }
}

function prevStep(currentStep) {
  showStep(currentStep - 1);
}

function selectOption(field, value) {
  selectedOptions[field] = value;
  formData[field] = value;
  
  // Update UI
  document.querySelectorAll(`.option-btn`).forEach(btn => {
    btn.classList.remove('border-indigo-500', 'bg-indigo-50');
  });
  event.target.classList.add('border-indigo-500', 'bg-indigo-50');
}

async function submitForm() {
  // Get final form data
  formData.softSkills = document.getElementById('softSkills').value;

  // Show loading
  document.querySelectorAll('.question-step').forEach(step => {
    step.classList.add('hidden');
  });
  document.getElementById('loading').classList.remove('hidden');

  try {
    const recommendations = await getCareerRecommendations(formData);
    displayResults(recommendations);
  } catch (error) {
    console.error("API Error:", error);
    document.getElementById('loading').classList.add('hidden');
    alert("Error getting recommendations. Please try again.");
  }
}

function displayResults(recommendations) {
  document.getElementById('loading').classList.add('hidden');
  
  // Display Career Paths
  const careerPathsContainer = document.getElementById('career-paths');
  careerPathsContainer.innerHTML = '';
  recommendations.careerPaths.forEach(path => {
    careerPathsContainer.innerHTML += `
      <div class="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-l-4 border-indigo-500">
        <h4 class="font-bold text-lg text-gray-800">${path.title}</h4>
        <p class="text-gray-600">${path.description}</p>
      </div>
    `;
  });

  // Display Courses
  const coursesContainer = document.getElementById('recommended-courses');
  coursesContainer.innerHTML = '';
  recommendations.courses.forEach(course => {
    coursesContainer.innerHTML += `
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-semibold text-gray-800">${course.title}</h4>
          <p class="text-gray-600 text-sm">${course.platform} ${course.free ? '(Free)' : '(Paid)'}</p>
        </div>
        <a href="${course.link}" target="_blank" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Visit →</a>
      </div>
    `;
  });

  // Display Project Ideas
  const projectsContainer = document.getElementById('project-ideas');
  projectsContainer.innerHTML = '';
  recommendations.projects.forEach(project => {
    projectsContainer.innerHTML += `
      <div class="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
        <h4 class="font-semibold text-gray-800">${project.title}</h4>
        <p class="text-gray-600">${project.description}</p>
      </div>
    `;
  });

  // Display Learning Resources
  const resourcesContainer = document.getElementById('learning-resources');
  resourcesContainer.innerHTML = '';
  recommendations.resources.forEach(resource => {
    resourcesContainer.innerHTML += `
      <div class="flex justify-between items-start py-2 border-b border-gray-200 last:border-0">
        <div>
          <h4 class="font-semibold text-gray-800">${resource.title}</h4>
          <p class="text-gray-600 text-sm">${resource.description}</p>
        </div>
        <a href="${resource.link}" target="_blank" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Visit →</a>
      </div>
    `;
  });

  // Show results
  document.getElementById('results').classList.remove('hidden');
}

function resetForm() {
  // Reset form data
  for (const key in formData) {
    formData[key] = '';
  }
  
  // Reset selected options
  for (const key in selectedOptions) {
    selectedOptions[key] = null;
  }
  
  // Reset UI
  document.getElementById('skills').value = '';
  document.getElementById('interests').value = '';
  document.getElementById('industries').value = '';
  document.getElementById('softSkills').value = '';
  
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.remove('border-indigo-500', 'bg-indigo-50');
  });
  
  document.getElementById('results').classList.add('hidden');
  showStep(1);
}