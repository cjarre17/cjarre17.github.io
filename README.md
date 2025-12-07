# The Ins and Outs of NGINX

**An Overview by Caleb Jarrell**

This repository hosts a multi-page website that serves as an interactive overview of the NGINX web server. It adapts my research paper titled "The Ins and Outs of Nginx" into a responsive, dynamic web experience.

## Project Details

*   **Author:** Caleb Jarrell
*   **Course:** IT 3203 - Intro to Web Development
*   **Instructor:** Professor Tucker
*   **Semester:** Fall 2025
*   **College:** Kennesaw State University (KSU)

## Features

This project demonstrates various web development concepts and techniques, including:

*   **Responsive Design:** A fully responsive layout that adapts to different screen sizes, featuring a custom hamburger menu for mobile devices.
*   **Layout Engines:** Utilizes **CSS Grid** for card-based layouts and **Flexbox** for alignment and structure.
*   **Theme System:** A functional theme system with automatic system theme functionality and a **Light/Dark mode toggle** that persists user preference. 
*   **Interactive Elements:**
    *   A JavaScript-powered **Quiz** to test knowledge of the content.
    *   Hover effects, transitions, and interactive navigation.
*   **Styling:** Consistent design using a single shared CSS file (`styles.css`), custom fonts (Montserrat), and a unified color palette.

## File Structure

*   **`index.html`**: The homepage containing the abstract, history, and a table of contents.
*   **`architecture.html`**: Explains NGINX's event-driven, non-blocking architecture and master-worker process model.
*   **`reverse-proxy.html`**: Details the role of NGINX as a reverse proxy, including load balancing and caching.
*   **`key-concepts.html`**: Defines essential terms like the C10K problem and compares NGINX to Apache.
*   **`references.html`**: A list of citations and resources used for the project.
*   **`about.html`**: Information about the author and the technical details of the site.
*   **`quiz.html`**: An interactive quiz to test the user's understanding of the material.
*   **`styles.css`**: The main stylesheet controlling the visual presentation of the site.
*   **`hamburger.js`**: Logic for the mobile navigation menu.
*   **`light-dark.js`**: Logic for the theme toggle switch.
*   **`quiz.js`**: Logic for the interactive quiz questions and scoring.

## Credits & Attributions

*   **Hamburger Menu:** Discovered and adapted from a YouTube video by *Treehouse*.
*   **Dark/Light Toggle:** Discovered and adapted from *RefractedColor* on CodePen (https://codepen.io/RefractedColor/pen/mdWZRPQ).
*   **Nginx Logo:** Sourced from *1000logos.net*.
*   **Content:** Based on original research by Caleb Jarrell.

## How to Run

Simply open `index.html` in any modern web browser to view the site; Or visit cjarre17.github.io. No build process or server installation is required.