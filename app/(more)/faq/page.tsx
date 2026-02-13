import React from "react";

export const faqs = [
  {
    question: "How do I create an account?",
    answer:
      "Click the Sign Up button on the top-right corner of the homepage. Enter your fullname, your username, your email, set a password, and verify your email to activate your account.",
  },
  {
    question: "How do I upload an image?",
    answer:
      "Go to the Social share page and click Upload Media. You can select files  from your device. After successfully uploading you can resize the image and download from there in various social media and formats.",
  },
  {
    question: "How do I transform an image?",
    answer:
      "After uploading, open home page on the image click the more button and 3 options appear the top option is open in studio, that opens the image in Editor Mode. Choose transformations like resize, crop, format conversion, or quality enhancement, etc. then click Apply.",
  },
  {
    question: "How do I edit an image?",
    answer:
      "Use built-in tools in the studio such as filters, blur, pixelate, borders, background removal, and face blur. You can preview changes live before saving, but this preview is not the real result of applied edit this is just an assumption to guide you to see the real result click on apply changes after every chnages made to image settings",
  },
  {
    question: "How do I upload a video?",
    answer:
      "In the video upload page select a video file, give a title and description if you wish, its optional but that helps you to search the video later.",
  },
  {
    question: "How do I change my account details?",
    answer:
      "Click on the profile icon from header and a dropdown appear from that Go to Profile from → Account Settings. From there you can update your name, email, and other personal details.",
  },
  {
    question: "How can I check which devices are logged in?",
    answer:
      "Navigate to Security tab from profile there You'll see all logged-in devices with location and last active time and status, and you can revoke session remotely.",
  },
  {
    question: "How do I set my preferences?",
    answer:
      "Go to Profile → Preferences. You can configure default formats, preferred theme, after how many days content will be deleted, and more.",
  },
  {
    question: "How do I change the theme?",
    answer:
      "Use the Theme Toggle in the navbar or go to settings from profile icon dropdown in header to switch between Light and Dark modes.",
  },
  {
    question: "How do I check how much storage is left?",
    answer:
      "Open Profile there all your uploaded images count, videos count, transformation points used and total and storage used and total are shown.",
  },
  {
    question: "What are Gems?",
    answer:
      "Gems are transformation ponints used to unlock features like Image transformation video transformation and edit. Actually our whole platform features dependent on this gems if you used all then features are restricted until your gems restored again. A image upload takes 2 gems video upload takes 4 gems and any kind of editting of image takes one gems.",
  },
  {
    question: "How many transformation points do I have left?",
    answer:
      "Your remaining transformation points are shown as gems on the navbar top right.Click on it and a toast message will appear.",
  },
  {
    question: "When Transformation Points & storage are restored?",
    answer:
      "Transformation Points & storages restored each week. At this moment we give 800 MB storage to have content without default media per week and 800 transformation per week",
  },
  {
    question: "How do I delete media?",
    answer:
      "We are currently storing all your uploaded media only for 7 days,It will be automatically deleted after 7 days. Though you can change the duration from profile → preferences → delete after days. And you can manually delete all your images or videos any time from settings.If you want to delete all media at once go to profile → Danger Zone → Delete all media → click Delete, and confirm. Deleted media is permanently removed from storage and cannot be recovered once performed.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "From profile go to Danger Zone tab there you'll found Delete account button after carefully reading the description. Confirm your your choice and submit the request. Your data will be permanently deleted after processing.",
  },
  {
    question: "Can I cancel an account deletion request?",
    answer:
      "Yes. If deletion request in progress, when you open website you will be redirected to account status page from there you can cancel your deletion request by clicking Cancel Request until last steps are taken.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-base-100 px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-base-content text-center mb-10">
        Frequently Asked Questions
      </h1>

      <div className="flex justify-center">
        <div className="join join-vertical w-full max-w-3xl bg-base-100 rounded-2xl shadow-lg">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="collapse collapse-arrow join-item border border-base-300"
            >
              <input
                type="radio"
                name="faq-accordion"
                defaultChecked={i === 0}
              />
              <div className="collapse-title font-semibold text-base-content text-lg">
                {faq.question}
              </div>
              <div className="collapse-content text-base-content/70 text-lg">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
