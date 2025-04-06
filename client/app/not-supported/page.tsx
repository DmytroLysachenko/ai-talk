import Link from "next/link";
import React from "react";

const NotSupportedPage = () => {
  return (
    <main className="flex flex-col items-center justify-center p-24">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-red-600">
          Browser Not Supported
        </h1>
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xl mb-4">
            We&apos;re sorry, but Mozilla Firefox doesn&apos;t support the
            Speech Recognition API that our application requires.
          </p>
          <p className="text-lg mb-6">
            Please use one of the following browsers to access our application:
          </p>
          <ul className="text-left inline-block mb-6">
            <li className="mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Google Chrome
            </li>
            <li className="mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Microsoft Edge
            </li>
            <li className="mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Safari
            </li>
          </ul>
        </div>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default NotSupportedPage;
