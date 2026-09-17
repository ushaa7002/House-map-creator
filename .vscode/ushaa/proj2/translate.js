```javascript
const stories = [
  {
    id: 1,
    category: "Technology",
    source: "Tech Daily",
    time: "18 min ago",
    sentiment: "Positive",
    title: "New battery design promises faster charging for electric vehicles",
    summary:
      "Researchers report a breakthrough that may cut charging time while extending battery life."
  },
  {
    id: 2,
    category: "Business",
    source: "Market Watch",
    time: "42 min ago",
    sentiment: "Neutral",
    title: "Global markets hold steady as investors await new economic data",
    summary:
      "Major indexes moved within a narrow range in a cautious start to the trading day."
  },
  {
    id: 3,
    category: "Sports",
    source: "The Sports Desk",
    time: "1 hr ago",
    sentiment: "Positive",
    title: "Underdogs secure dramatic victory in the final minutes",
    summary:
      "A late goal completed a memorable comeback and lifted the team up the table."
  },
  {
    id: 4,
    category: "Science",
    source: "Science Brief",
    time: "2 hrs ago",
    sentiment: "Positive",
    title: "Space telescope captures detailed images of distant star formation",
    summary:
      "The new observations could help scientists understand how planetary systems emerge."
  },
  {
    id: 5,
    category: "World",
    source: "Global Report",
    time: "3 hrs ago",
    sentiment: "Negative",
    title: "Leaders call for coordinated response after severe weather disruption",
    summary:
      "Officials are focusing on recovery efforts and support for affected communities."
  },
  {
    id: 6,
    category: "Technology",
    source: "Future Now",
    time: "4 hrs ago",
    sentiment: "Neutral",
    title: "Companies outline practical rules for responsible use of AI",
    summary:
      "The proposals focus on transparency, safety testing, and human oversight."
  },
  {
    id: 7,
    category: "Business",
    source: "Economic Journal",
    time: "5 hrs ago",
    sentiment: "Positive",
    title: "Small businesses report a rise in confidence and hiring plans",
    summary:
      "A new survey points to optimism across several local service industries."
  },
  {
    id: 8,
    category: "Sports",
    source: "Arena News",
    time: "6 hrs ago",
    sentiment: "Neutral",
    title: "Championship organizers announce schedule for the new season",
    summary:
      "The expanded event calendar includes more venues and youth competitions."
  }
];


// --------------------------------------------------
// GLOBAL VARIABLES
// --------------------------------------------------

let activeCategory = "All";
let searchTerm = "";

let bookmarks = JSON.parse(
  localStorage.getItem("newsInsightBookmarks") || "[]"
);


// --------------------------------------------------
// HELPER FUNCTION
// --------------------------------------------------

const $ = (selector) => document.querySelector(selector);

const sentimentClass = (value) => {
  return value.toLowerCase();
};


// --------------------------------------------------
// FILTER STORIES
// --------------------------------------------------

function visibleStories() {
  return stories.filter((story) => {

    const matchesCategory =
      activeCategory === "All" ||
      story.category === activeCategory;

    const text = `
      ${story.title}
      ${story.summary}
      ${story.source}
      ${story.category}
    `.toLowerCase();

    const matchesSearch =
      text.includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });
}


// --------------------------------------------------
// CREATE STORY CARD
// --------------------------------------------------

function storyCard(story) {

  const saved = bookmarks.includes(story.id);

  return `
    <article class="story">

      <div class="story-top">
        <span class="source">${story.source}</span>
        <span class="time">${story.time}</span>
      </div>

      <h3>${story.title}</h3>

      <p>${story.summary}</p>

      <div class="story-footer">

        <span class="tag ${sentimentClass(story.sentiment)}">
          ${story.sentiment}
        </span>

        <button
          class="bookmark ${saved ? "saved" : ""}"
          data-id="${story.id}"
          aria-label="Save ${story.title}"
          title="Save article"
        >
          ${saved ? "★" : "☆"}
        </button>

      </div>

    </article>
  `;
}


// --------------------------------------------------
// RENDER NEWS
// --------------------------------------------------

function renderNews() {

  const visible = visibleStories();

  $("#newsGrid").innerHTML =
    visible.map(storyCard).join("");

  $("#resultCount").textContent =
    `${visible.length} ${
      visible.length === 1 ? "story" : "stories"
    }`;

  $("#emptyState").hidden =
    visible.length !== 0;

  renderSentiment(visible);

  // Add bookmark events
  document
    .querySelectorAll("#newsGrid .bookmark")
    .forEach((button) => {
      button.addEventListener("click", toggleBookmark);
    });
}


// --------------------------------------------------
// RENDER SENTIMENT
// --------------------------------------------------

function renderSentiment(list) {

  const labels = [
    "Positive",
    "Neutral",
    "Negative"
  ];

  const total = list.length || 1;

  $("#sentimentBars").innerHTML =
    labels
      .map((label) => {

        const count =
          list.filter(
            (item) => item.sentiment === label
          ).length;

        const percent =
          Math.round((count / total) * 100);

        return `
          <div class="sentiment-row">

            <span>${label}</span>

            <div class="track">
              <div
                class="fill ${sentimentClass(label)}"
                style="width: ${percent}%"
              ></div>
            </div>

            <b>${percent}%</b>

          </div>
        `;
      })
      .join("");
}


// --------------------------------------------------
// RENDER BOOKMARKS
// --------------------------------------------------

function renderBookmarks() {

  const savedStories =
    stories.filter((story) =>
      bookmarks.includes(story.id)
    );

  $("#bookmarkGrid").innerHTML =
    savedStories.map(storyCard).join("");

  $("#bookmarkEmpty").hidden =
    savedStories.length > 0;

  $("#savedCount").textContent =
    savedStories.length;

  // Add bookmark events
  document
    .querySelectorAll("#bookmarkGrid .bookmark")
    .forEach((button) => {
      button.addEventListener("click", toggleBookmark);
    });
}


// --------------------------------------------------
// TOGGLE BOOKMARK
// --------------------------------------------------

function toggleBookmark(event) {

  const id =
    Number(event.currentTarget.dataset.id);

  if (bookmarks.includes(id)) {

    // Remove bookmark
    bookmarks =
      bookmarks.filter(
        (item) => item !== id
      );

  } else {

    // Add bookmark
    bookmarks.push(id);
  }

  // Save to localStorage
  localStorage.setItem(
    "newsInsightBookmarks",
    JSON.stringify(bookmarks)
  );

  // Update page
  renderNews();
  renderBookmarks();
}


// --------------------------------------------------
// RENDER DASHBOARD
// --------------------------------------------------

function renderDashboard() {

  const categories = [
    ...new Set(
      stories.map(
        (story) => story.category
      )
    )
  ];

  const counts =
    categories.map((category) => {

      return {
        category: category,
        count: stories.filter(
          (story) =>
            story.category === category
        ).length
      };

    });

  const max = Math.max(
    ...counts.map(
      (item) => item.count
    )
  );

  // Total stories
  $("#totalStories").textContent =
    stories.length;


  // Most active category
  const topCategory =
    [...counts].sort(
      (a, b) => b.count - a.count
    )[0];

  if (topCategory) {
    $("#topCategory").textContent =
      topCategory.category;
  }


  // Category chart
  $("#categoryChart").innerHTML =
    counts
      .map((item) => {

        const height =
          (item.count / max) * 125;

        return `
          <div class="bar-group">

            <b>${item.count}</b>

            <div
              class="bar"
              style="height: ${height}px"
            ></div>

            <span>${item.category}</span>

          </div>
        `;
      })
      .join("");


  // Trending topics
  const trendingTopics = [
    "Artificial Intelligence",
    "Market Update",
    "Clean Energy",
    "Space Discovery",
    "Championship"
  ];

  $("#trendingList").innerHTML =
    trendingTopics
      .map((topic, index) => {

        const percentage =
          82 - index * 9;

        return `
          <li>
            ${topic}
            <span>${percentage}%</span>
          </li>
        `;
      })
      .join("");
}


// --------------------------------------------------
// SEARCH
// --------------------------------------------------

function setupSearch() {

  $("#searchInput").addEventListener(
    "input",
    (event) => {

      searchTerm =
        event.target.value.trim();

      renderNews();
    }
  );
}


// --------------------------------------------------
// CATEGORY FILTER
// --------------------------------------------------

function setupFilters() {

  document
    .querySelectorAll(".filter")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          activeCategory =
            button.dataset.category;

          document
            .querySelectorAll(".filter")
            .forEach((item) => {

              item.classList.toggle(
                "active",
                item === button
              );

            });

          renderNews();
        }
      );

    });
}


// --------------------------------------------------
// DARK MODE
// --------------------------------------------------

function setupTheme() {

  const themeButton =
    $("#themeToggle");


  themeButton.addEventListener(
    "click",
    () => {

      const dark =
        document.body.classList.toggle(
          "dark"
        );

      localStorage.setItem(
        "newsInsightDarkMode",
        dark
      );

      themeButton.textContent =
        dark ? "☀️" : "🌙";

      themeButton.setAttribute(
        "aria-label",
        dark
          ? "Switch to light mode"
          : "Switch to dark mode"
      );

    }
  );


  // Load saved theme
  if (
    localStorage.getItem(
      "newsInsightDarkMode"
    ) === "true"
  ) {

    document.body.classList.add("dark");

    themeButton.textContent = "☀️";

    themeButton.setAttribute(
      "aria-label",
      "Switch to light mode"
    );
  }
}


// --------------------------------------------------
// START APPLICATION
// --------------------------------------------------

document.addEventListener(
  "DOMContentLoaded",
  () => {

    setupSearch();

    setupFilters();

    setupTheme();

    renderDashboard();

    renderNews();

    renderBookmarks();

  }
);
```
