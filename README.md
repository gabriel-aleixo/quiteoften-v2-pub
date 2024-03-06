# README

## Overview

Quiteoften is an online workspace where managers of remote workers can manage both sync (meetings) and async work with each person in their team. 

It offers a range of features aimed at enhancing productivity and connectivity in professional settings.

The Quiteoften application enables users to create accounts, log in securely, and access a variety of functionalities, including real-time task management and video conferencing.

## Website
[Quiteoften.app](https://quiteoften.app)

## Client

### App Component

Sets up the routing for different pages, including the logged-in home page, login, signup, and authentication pages. 

### LoggedHome Component

The home page of the application for logged-in users. It fetches user authentication data and displays the main content. Users can navigate through different sections using tabs.

### Main Component

The `Main` component is responsible for rendering the main content based on user interactions. It displays either current or past task and projects depending on the selected tab and pair.

### Nav Component

Displays a list of paired users and allows users to select different pairs to communicate with. Users can also add new users to their workspace.

### VideoConference Component

The `VideoConference` component facilitates video conferencing functionalities within the Quiteoften application. The component integrates with the Jitsi Meet platform. `JitsiMeetComponent` handles the setup and configuration of Jitsi Meet, while `JitsiMeetPortal` facilitates the integration of Jitsi Meet into different parts of the application through portals. Key features:

- **Dynamic Room Name Generation:** The component dynamically generates room names based on user and pair IDs to ensure unique meeting spaces for each interaction.
  
- **Customizable Interface:** Users can customize the video conferencing interface with various configuration options, such as toolbar buttons, interface layout, and display settings.
  
- **Event Handling:** The component handles video conference events, such as user joining and leaving, to provide a smooth and responsive user experience.

### RightBar Component

Includes functionalities for managing discussions, actions, and meeting controls. Key features include:

- **Copy Link to Call:** Users can copy the meeting link to share it with participants, facilitating easy access to the video conference.
  
- **Discussion and Action Boxes:** Users can view and manage discussion items and action items within dedicated boxes, promoting collaboration and task management.

### GenericBox Component

The `GenericBox` component serves as a generic container for displaying lists of items, such as discussion topics or action items. It offers customizable options for filtering, adding, deleting, and toggling the completion status of items.

### AddItem Component

The `AddItem` component provides a form for users to add new items to discussion or action lists within the application. Items are updated in real-time using SWR.

### EmailForm and AddPerson Components

Users can enter email addresses and send invitations to join the platform, enabling seamless expansion of the user base.

## Server

The server code handles environment variables, database connections, and API functions. It utilizes Express for routing and middleware setup.

## Main Dependencies

- React
- react-router-dom
- swr
- react-reverse-portal
- Sentry
- Express
- Axios


## Usage

To run the application:

1. Install dependencies using `npm install`.
2. Run the application using `npm start-dev`.

## Contributing

Although this project is no longer supported, feel free to fork the repository, make changes, and use the code.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
