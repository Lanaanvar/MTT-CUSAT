import { Registration } from '../services/registrations';

export function convertRegistrationsToCSV(registrations: Registration[]): string {
  // Define CSV headers
  const headers = [
    'Name',
    'Email',
    'Phone',
    'College',
    'Department',
    'Year',
    'Membership Type',
    'IEEE Membership ID',
    'Registration Date',
    'Status',
    'Payment Status',
    'Amount'
  ];

  // Convert registrations to CSV rows
  const rows = registrations.map(reg => [
    reg.name,
    reg.email,
    reg.phone,
    reg.college,
    reg.department,
    reg.year,
    reg.membershipType === 'ieee' ? 'IEEE Member' : 'Non-IEEE Member',
    reg.membershipId || 'N/A',
    reg.registrationDate,
    reg.status,
    reg.paymentStatus,
    `₹${reg.amount}`
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create download link
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
} 