# Indu's Friendship Note + Skydiving Invitation 🌸🪂

A phone-friendly, three-chapter website by Sunil for his friend Indu. It includes a genuine apology, animated floating flowers, a skydiving invitation, and a personalized response page for either answer. The "No" button playfully moves a maximum of twice, then stays selectable; keyboard users can pick "No" immediately.

## Open it / publish it

1. Keep `index.html`, `style.css`, and `script.js` together in the same folder.
2. Open `index.html` to preview it on your computer, or upload all three files to the **root** of a public GitHub repository.
3. On GitHub, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Your site will be at a GitHub Pages URL such as `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.
5. Share the link with Indu.

## How her answer gets to you

**Works immediately without accounts:** Her Yes or No is stored in **her browser's local storage**, not yours. Her answer page offers **Share my answer**, **Copy reply**, and **Open Instagram DMs**. Share uses the phone's native sharing sheet when available; Instagram DMs opens the Instagram inbox, where she manually picks your conversation and pastes her reply. Browsers can't silently send Instagram private messages on someone's behalf.

**Optional: get a Yes or No emailed to you automatically:**

1. Visit https://formspree.io/ and sign up for a free account. Make a new form, and set the notification email to the address where **you** want the answer.
2. Copy your form endpoint (it looks like `https://formspree.io/f/abcdefgh`).
3. Open `script.js`, find the `SETTINGS` block near the top, and put your endpoint between the quotes for `formspreeEndpoint`.
4. Re-upload the updated `script.js` to GitHub. Test once: after you select Yes or No, the result page should say **"Your answer has been sent to Sunil! ✅"**. Check your Formspree submissions and notification email. New Formspree accounts may require email confirmation.

With Formspree configured, the website clearly tells Indu **before** choosing that her answer will be sent to Sunil. If automatic delivery fails, she can use the Share button. The site does not collect her phone number, address, or Instagram login.

## Simple customization

- To edit the apology and skydiving invitation, update the text in `index.html`.
- To change your name or the share message, edit `replyMessages` in `script.js`.
- To change colors, see the custom properties at the start of `style.css`.
- Keep it friendly: the note is intentionally about **friendship**, not romance.

Made for GitHub Pages. No Node.js, database, build tools, or API key is required to run it.
