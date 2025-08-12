'use client'

import { Button } from "flowbite-react";
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";
import Link from "next/link";


const LandingPage = () => {


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 m-1">
      <section className="text-center bg-gray-50 shadow-2xl rounded-2xl px-3 py-6 max-w-4xl mx-auto mt-6">
        <h1 className="text-5xl font-extrabold mb-4 text-cyan-700 ">Simple, Secure, Smart Polls</h1>
        <p className="text-lg text-gray-700  mb-6">
          Create anonymous, one-vote-per-person polls with just an email. No tracking, no fuss — just meaningful votes.
        </p>
        <div className="flex justify-center space-x-4">
          <Button as={Link} href="/signup" color="cyan">Get Started</Button>
          <Button as={Link} href="/login" color="cyan">Login</Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-12 max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
        <div className="bg-white  p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-cyan-600  mb-2">🗳️ One Vote Per Participant</h2>
          <p>Each participant receives a unique link via email. No duplication, no tampering—pure democracy.</p>
        </div>
        <div className="bg-white  p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-cyan-600  mb-2">📅 Expiry-Controlled Voting</h2>
          <p>Set deadlines to keep polls timely and relevant. Only votes within the window are counted.</p>
        </div>
        <div className="bg-white  p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-cyan-600  mb-2">👥 Participant Lists</h2>
          <p>Save frequent voters and add them to polls with one click. Your community, streamlined.</p>
        </div>
        <div className="bg-white  p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-cyan-600  mb-2">🔐 Anonymous & Secure</h2>
          <p>Votes are anonymous by design, yet traceable by origin — ensuring integrity and privacy.</p>
        </div>
      </section>

      {/* FAQ Section with Accordion */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 ">FAQs</h2>
        <Accordion collapseAll>
          <AccordionPanel>
            <AccordionTitle>How do I create a poll?</AccordionTitle>
            <AccordionContent>
              Use the dashboard to set a poll name, description, deadline, and add participants via email. One click—and done!
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel>
            <AccordionTitle>Can I reuse participant lists?</AccordionTitle>
            <AccordionContent>
              Yes! Create lists for frequent voters and reuse them across any poll. It saves time and ensures consistency.
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel>
            <AccordionTitle>Is it really anonymous?</AccordionTitle>
            <AccordionContent>
              100%. While each participant is verified via email, vote data is not tied to identity. Only participation status is tracked.
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="bg-white  text-center py-6 mt-12 border-t ">
        <p className="text-sm text-gray-600 ">&copy; 2025 Polling App</p>
      </footer>
    </div>

  )
};

export default LandingPage;
