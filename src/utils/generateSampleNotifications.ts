import { v4 as uuidv4 } from 'uuid';

const generateSampleNotifications = (): AdminNotification[] => {
  const notificationTypes: NotificationType[] = [
    'inventory', 
    'service_request', 
    'implementation_plan', 
    'personnel'
  ];

  const messages = {
    inventory: [
      "New Item has been added by the Engineering Department",
      "New Item has been added by the Grounds Department",
      "New Item has been added by the NSTP Department"
    ],
    service_request: [
      "New CCTV service request submitted",
      "New Aircon service request submitted",
      "Aircon service requested has been rated by the requestor"
    ],
    implementation_plan: [
      "New implementation plan created by Thelanny Maguillano",
      "Tasks completed for Aircon implementation plan",
      "All tasks for Plumbing implementation plan has been completed"
    ],
    personnel: [
      `Aljason Javier has been assigned to "Check records" task`,
      `Carlo Macoco has been assigned to "Find supplier" task`,
      `Sheree Laluma has been assigned to "Set meeting" task`
    ]
  };

  const generateNotification = (type: NotificationType): AdminNotification => {
    const now = new Date();
    
    // Randomize date within the last week
    const randomDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    return {
      id: uuidv4(),
      type,
      message: messages[type][Math.floor(Math.random() * messages[type].length)],
      isRead: Math.random() > 0.5, // Randomly mark some as read
      createdAt: randomDate.toISOString()
    };
  };

  // Generate 10-15 sample notifications
  return Array.from({ length: Math.floor(Math.random() * 6 + 10) }, () => 
    generateNotification(notificationTypes[Math.floor(Math.random() * notificationTypes.length)])
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export default generateSampleNotifications;