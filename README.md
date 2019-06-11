# My DNA coding test

I have created a GUI web application for the coding test.

## Web app built in Angular 7

![Web App](https://github.com/VeritasSoftware/my-dna/blob/master/my-dna/src/Screenshot.PNG)

### The app consists of

*   A **RobotPipettingService** Service which parses the Commands text using **regular expressions**.
*   A **Home** component for the UI. The Service is injected into this component.

### The Commands supported are

*   PLACE
*   DROP
*   MOVE

Since this is a GUI solution, we do not need DETECT, REPORT.

## Web app deployed to Google cloud

[**Online app - Give it a try!**](https://my-dna-coding-test.firebaseapp.com)

## Angular details

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.2.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

