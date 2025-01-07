// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1

import { test,expect } from "@playwright/test";


test("Validate 100 articles are sorted from newest to oldest", async ({ page }) => {
  // Navigate to the Hacker News newest page
  await page.goto("https://news.ycombinator.com/newest");

  // Initialize an array to store the articles
  const articles = [];

  // Loop until we have 100 articles
  //Using a loop to extract article IDs and timestamps until 100 articles were collected.
  while (articles.length < 100) {
    // Collect articles from the current page
    const newArticles = await page.evaluate(() => {
      // Select all article elements on the page
      const elements = Array.from(document.querySelectorAll('tr.athing.submission'));
      return elements.map(el => ({
        id: el.id, // Get the unique ID of the article
        time: el.nextElementSibling.querySelector('.age').getAttribute('title') // Get the timestamp from the title attribute
      }));
    });

    // Add new articles to the list,making sure only unique articles are added to the to the articles array..
    
    for (const article of newArticles) {
      if (!articles.some(a => a.id === article.id)) {
        articles.push(article); // Add unique articles to the array
      }
    }

    // If we have less than 100 articles, click "More" to load more
    if (articles.length < 100) {
      await page.click('a.morelink'); // Click on the "More" link to load additional articles
      await page.waitForTimeout(2000); // Wait for new content to load (2 seconds)
    }
  }

  // Trim the articles array to exactly 100 if it exceeds that
  const trimmedArticles = articles.slice(0, 100);

  // Ensure we have exactly 100 articles
  expect(trimmedArticles.length).toBe(100);

  // Validate that articles are sorted from newest to oldest
  for (let i = 1; i < trimmedArticles.length; i++) {
    const prevTime = new Date(trimmedArticles[i - 1].time).getTime(); // Get timestamp of previous article
    const currTime = new Date(trimmedArticles[i].time).getTime(); // Get timestamp of current article

    // Checking if there  any invalid dates
    if (isNaN(prevTime) || isNaN(currTime)) {
      console.warn(`Invalid date: ${trimmedArticles[i - 1].time} or ${trimmedArticles[i].time}`);//both timestamps being compared, which helps pinpoint where the issue occurred.
      continue; // Skip invalid dates and continue with the next iteration
    }

    // Expect that the previous article's time is greater than or equal to the current article's time
    expect(prevTime).toBeGreaterThanOrEqual(currTime);
  }
});