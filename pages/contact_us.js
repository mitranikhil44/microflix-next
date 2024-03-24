import React, { useState, useEffect } from "react";
import { HiUser, HiMail, HiPhone, HiChatAlt } from "react-icons/hi";
import { useWebStore } from "../context/WebStore";

function Contact() {
  const { progress, setProgress } = useWebStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/postcontact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        timeout: 15000,
      });

      if (response.ok) {
        console.log("Success:", await response.json());
        setFormData({
          name: "",
          email: "",
          contact: "",
          message: "",
        });
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    setProgress(100);
  }, []);

  return (
    <>
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center my-12"
    >
      <div className="shadow rounded py-8 px-12 bg-white">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Let’s chat and get a quote!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
            >
              Name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="block w-full mt-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full mt-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="contact"
            className="block text-sm font-semibold text-gray-700"
          >
            Contact No.{" "}
            <span className="text-sm text-gray-700">(optional)</span>
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            value={formData.contact}
            onChange={handleChange}
            className="block w-full mt-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            placeholder="Enter your contact number"
          />
        </div>

        <div className="mt-6 text-gray-700">
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-gray-700"
          >
            Message <span className="text-red-600">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="block w-full mt-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 resize-none"
            rows="4"
            placeholder="Enter your message"
            required
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="block w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </form>
    </>
  );
}

export default Contact;
