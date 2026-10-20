import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Digi Rathi HRMS - Today Attendance Dashboard',
  description: 'Manage and review real-time employee attendance status and location metrics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
