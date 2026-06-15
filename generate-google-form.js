/**
 * AI Creatives Showcase Registration Form Generator
 * 
 * Instructions:
 * 1. Go to https://script.google.com/ (Google Apps Script)
 * 2. Click "New Project"
 * 3. Delete any code in Code.gs and paste this script.
 * 4. Click the "Run" button (make sure buildShowcaseForm is selected).
 * 5. Review permissions when prompted to let Google Apps Script create the form in your Drive.
 * 6. The console logs will print the live form URL and edit URL!
 */

function buildShowcaseForm() {
  const formName = "AI Creatives Showcase - Registration Form";
  const form = FormApp.create(formName);
  
  // Set Title and Description
  form.setTitle("AI Creatives Showcase - Registration")
      .setDescription(
        "A Creative Filmmaking Challenge for Students!\n" +
        "Imagine. Create. Inspire.\n\n" +
        "Team up in groups of 2 and bring your imagination to life using AI! Create a cinematic film with a concept, storyboarding, and handcrafted sketches.\n\n" +
        "Registration Starts: 15th June\n" +
        "Event Duration: 15th June to 24th July\n" +
        "Winners Announced: 25th July\n\n" +
        "🏆 PRIZES: Winners get two PVR SPIDER-MAN Tickets! 🕷️🕸️\n" +
        "To know more, visit our Instagram page @braandschool.\n\n" +
        "(* Required fields)"
      );

  // Set response configuration
  form.setConfirmationMessage("Thank you for registering for the AI Creatives Showcase! Your team registration has been recorded. Make sure to submit all related assets properly before 24th July. We will contact you soon via email. See you at the movies! 🎬🍿");
  form.setAllowResponseEdits(false);
  form.setLimitOneResponsePerUser(false);
  form.setPublishingSummary(false);

  // SECTION 1: Team & Leader Details
  form.addSectionHeaderItem()
      .setTitle("Step 1: Team & Leader Information")
      .setHelpText("Provide the core details of your filmmaking team and your primary contact (Member 1).");

  // Team Name
  const teamNameItem = form.addTextItem();
  teamNameItem.setTitle("Team Name")
              .setRequired(true);

  // Leader Name
  const leaderNameItem = form.addTextItem();
  leaderNameItem.setTitle("Team Leader Name (Member 1)")
                .setRequired(true);

  // Leader Email
  const leaderEmailItem = form.addTextItem();
  leaderEmailItem.setTitle("Leader Email Address")
                 .setRequired(true);
  const emailValidation = FormApp.createTextValidation()
                                  .requireTextIsEmail()
                                  .setHelpText("Please enter a valid email address.")
                                  .build();
  leaderEmailItem.setValidation(emailValidation);

  // Leader Phone
  const leaderPhoneItem = form.addTextItem();
  leaderPhoneItem.setTitle("Leader Phone Number")
                 .setRequired(true);
  const phoneValidation = FormApp.createTextValidation()
                                 .requireTextLengthGreaterThanOrEqualTo(10)
                                 .requireTextLengthLessThanOrEqualTo(12)
                                 .setHelpText("Please enter a valid phone number (10-12 digits).")
                                 .build();
  leaderPhoneItem.setValidation(phoneValidation);

  // School/Institution Name
  const institutionItem = form.addTextItem();
  institutionItem.setTitle("School / College / Institution Name")
                 .setRequired(true);

  // Page Break to Section 2
  form.addPageBreakItem().setTitle("Step 2: Teammate Information");

  // Teammate 2 Name
  const member2NameItem = form.addTextItem();
  member2NameItem.setTitle("Teammate Name (Member 2)")
                 .setRequired(true);

  // Teammate 2 Email
  const member2EmailItem = form.addTextItem();
  member2EmailItem.setTitle("Teammate Email Address")
                  .setRequired(true)
                  .setValidation(emailValidation);

  // Teammate 2 Phone
  const member2PhoneItem = form.addTextItem();
  member2PhoneItem.setTitle("Teammate Phone Number")
                  .setRequired(true)
                  .setValidation(phoneValidation);
  // Page Break to Section 3
  form.addPageBreakItem().setTitle("Step 3: Creative Details & Checklist");

  // Initial Film Concept (Optional)
  const conceptItem = form.addParagraphTextItem();
  conceptItem.setTitle("Initial Film Concept / Theme Idea (Optional)")
             .setHelpText("Briefly describe your creative direction or the AI tools (Midjourney, Runway, Kling, Stable Diffusion, etc.) you intend to use.");

  // Checklist item
  const checklistItem = form.addCheckboxItem();
  checklistItem.setTitle("Confirm requirements to register")
               .setRequired(true);
  
  checklistItem.setChoices([
    checklistItem.createChoice("We confirm that we are registering as a team of 2 students.", true),
    checklistItem.createChoice("We are Spider-Man fans! 🕷️🕸️", true),
    checklistItem.createChoice("We agree to submit all related files/assets properly before the deadline.", true)
  ]);

  // Page Break to Section 4
  form.addPageBreakItem().setTitle("Step 4: Submission Link");

  // Google Drive link
  const driveLinkItem = form.addTextItem();
  const urlValidation = FormApp.createTextValidation()
                                .requireTextIsUrl()
                                .setHelpText("Please enter a valid URL (e.g., https://drive.google.com/...).")
                                .build();
  driveLinkItem.setTitle("Google Drive Link of Your Work")
               .setHelpText("Please provide the link to a shared Google Drive folder containing your film, storyboard, and sketches. Make sure link sharing is set to 'Anyone with the link can view'.")
               .setRequired(true)
               .setValidation(urlValidation);  // Output Links
  Logger.log('================================================================');
  Logger.log('Success! Your Google Form has been created.');
  Logger.log('Published Form Link (Send to registrants): ' + form.getPublishedUrl());
  Logger.log('Edit Form Link (Keep secret, for settings/responses): ' + form.getEditUrl());
  Logger.log('================================================================');
}
