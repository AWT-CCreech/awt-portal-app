const setDocumentTitle = (path: string): void => {
    switch (path) {
      case '/':
        document.title = 'AWT Portal | Home';
        break;
      case '/login':
        document.title = 'AWT Portal | Login';
        break;
      case '/massmailer':
        document.title = 'AWT Portal | Mass Mailer';
        break;
      case '/timetracker':
        document.title = 'AWT Portal | Time Tracker';
        break;
      case '/mastersearch':
        document.title = 'AWT Portal | Master Search';
        break;
      case '/opensalesorderreport':
          document.title = 'AWT Portal | Open SO Report';
          break;
      case '/dropship':
        document.title = 'AWT Portal | Drop Ship';
        break;
      case '/userlist':
        document.title = 'AWT Portal | User List';
        break;
      default:
        document.title = 'AWT Portal | Menu';
    }
  };
  
export default setDocumentTitle;
  