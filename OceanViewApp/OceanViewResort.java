import java.io.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class OceanViewResort {

    private static final String RESERVATIONS_FILE = "reservations.txt";
    private static final String USERS_FILE = "users.txt";
    private static final Scanner scanner = new Scanner(System.in);

    // Room rates
    private static final double SINGLE_RATE = 100.0;
    private static final double DOUBLE_RATE = 150.0;
    private static final double SUITE_RATE = 250.0;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static void main(String[] args) {
        initializeFiles();
        System.out.println("=========================================");
        System.out.println("    Welcome to Ocean View Resort");
        System.out.println("=========================================");

        if (!login()) {
            System.out.println("Too many failed attempts. Exiting system...");
            return;
        }

        boolean running = true;
        while (running) {
            System.out.println("\n--- Main Menu ---");
            System.out.println("1. Add New Reservation");
            System.out.println("2. Display Reservation Details");
            System.out.println("3. Calculate and Print Bill");
            System.out.println("4. System Help Section");
            System.out.println("5. Exit System");
            System.out.print("Enter your choice (1-5): ");

            String choice = scanner.nextLine().trim();

            switch (choice) {
                case "1":
                    addReservation();
                    break;
                case "2":
                    displayReservationDetails();
                    break;
                case "3":
                    calculateAndPrintBill();
                    break;
                case "4":
                    displayHelp();
                    break;
                case "5":
                    System.out.println("Thank you for using Ocean View Resort Reservation System. Goodbye!");
                    running = false;
                    break;
                default:
                    System.out.println("Invalid choice. Please select a valid option from 1 to 5.");
            }
        }
    }

    private static void initializeFiles() {
        try {
            File usersFile = new File(USERS_FILE);
            if (!usersFile.exists()) {
                usersFile.createNewFile();
                // Add a default user: admin / password123
                try (PrintWriter writer = new PrintWriter(new FileWriter(usersFile))) {
                    writer.println("admin,password123");
                }
            }

            File reservationsFile = new File(RESERVATIONS_FILE);
            if (!reservationsFile.exists()) {
                reservationsFile.createNewFile();
            }
        } catch (IOException e) {
            System.out.println("Error initializing system files: " + e.getMessage());
        }
    }

    private static boolean login() {
        System.out.println("\n--- Staff Login ---");
        int attempts = 0;
        Map<String, String> validUsers = loadUsers();

        while (attempts < 3) {
            System.out.print("Enter Username: ");
            String username = scanner.nextLine().trim();
            System.out.print("Enter Password: ");
            String password = scanner.nextLine().trim();

            if (validUsers.containsKey(username) && validUsers.get(username).equals(password)) {
                System.out.println("\nLogin Successful! Welcome, " + username + ".");
                return true;
            } else {
                System.out.println("Invalid username or password.");
                attempts++;
                if (attempts < 3) {
                    System.out.println("Attempts remaining: " + (3 - attempts));
                }
            }
        }
        return false;
    }

    private static Map<String, String> loadUsers() {
        Map<String, String> users = new HashMap<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(USERS_FILE))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length == 2) {
                    users.put(parts[0].trim(), parts[1].trim());
                }
            }
        } catch (IOException e) {
            System.out.println("Error loading users: " + e.getMessage());
        }
        return users;
    }

    private static void addReservation() {
        System.out.println("\n--- Add New Reservation ---");

        System.out.print("Enter Reservation Number (e.g., RES100): ");
        String resNum = scanner.nextLine().trim();

        if (resNum.isEmpty()) {
            System.out.println("Error: Reservation number cannot be empty.");
            return;
        }

        // Check if exists
        String[] existing = getReservation(resNum);
        if (existing != null) {
            System.out.println("Error: A reservation with this number already exists.");
            return;
        }

        System.out.print("Enter Guest Name: ");
        String name = scanner.nextLine().trim().replace(",", " "); // Avoid CSV break

        System.out.print("Enter Address: ");
        String address = scanner.nextLine().trim().replace(",", " ");

        System.out.print("Enter Contact Number: ");
        String contact = scanner.nextLine().trim().replace(",", " ");

        System.out.println("Available Room Types:");
        System.out.println(" - Single ($100/night)");
        System.out.println(" - Double ($150/night)");
        System.out.println(" - Suite  ($250/night)");
        System.out.print("Enter Room Type (Single/Double/Suite): ");
        String roomType = scanner.nextLine().trim();

        if (!roomType.equalsIgnoreCase("Single") && !roomType.equalsIgnoreCase("Double")
                && !roomType.equalsIgnoreCase("Suite")) {
            System.out.println("Error: Invalid room type selected. Please choose Single, Double, or Suite.");
            return;
        }

        LocalDate checkIn = null;
        LocalDate checkOut = null;

        try {
            System.out.print("Enter Check-in Date (YYYY-MM-DD): ");
            checkIn = LocalDate.parse(scanner.nextLine().trim(), DATE_FORMATTER);

            System.out.print("Enter Check-out Date (YYYY-MM-DD): ");
            checkOut = LocalDate.parse(scanner.nextLine().trim(), DATE_FORMATTER);

            if (!checkOut.isAfter(checkIn)) {
                System.out.println("Error: Check-out date must be after Check-in date.");
                return;
            }
        } catch (DateTimeParseException e) {
            System.out.println("Error: Invalid date format. Please use the YYYY-MM-DD format (e.g., 2024-12-01).");
            return;
        }

        // Save to file
        try (PrintWriter writer = new PrintWriter(new FileWriter(RESERVATIONS_FILE, true))) {
            // Format: ResNo,Name,Address,Contact,RoomType,CheckIn,CheckOut
            String record = String.join(",", resNum, name, address, contact, roomType, checkIn.toString(),
                    checkOut.toString());
            writer.println(record);
            System.out.println("\n>> Reservation added and saved successfully! <<");
        } catch (IOException e) {
            System.out.println("Error saving reservation: " + e.getMessage());
        }
    }

    private static void displayReservationDetails() {
        System.out.println("\n--- Display Reservation Details ---");
        System.out.print("Enter Reservation Number to search: ");
        String searchNum = scanner.nextLine().trim();

        String[] record = getReservation(searchNum);
        if (record != null) {
            printReservationCard(record);
        } else {
            System.out.println("No reservation found with number: " + searchNum);
        }
    }

    private static void calculateAndPrintBill() {
        System.out.println("\n--- Calculate and Print Bill ---");
        System.out.print("Enter Reservation Number: ");
        String searchNum = scanner.nextLine().trim();

        String[] record = getReservation(searchNum);
        if (record == null) {
            System.out.println("No reservation found with number: " + searchNum);
            return;
        }

        try {
            String resNum = record[0];
            String name = record[1];
            String roomType = record[4];
            LocalDate checkIn = LocalDate.parse(record[5], DATE_FORMATTER);
            LocalDate checkOut = LocalDate.parse(record[6], DATE_FORMATTER);

            long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
            double ratePerNight = 0;

            if (roomType.equalsIgnoreCase("Single"))
                ratePerNight = SINGLE_RATE;
            else if (roomType.equalsIgnoreCase("Double"))
                ratePerNight = DOUBLE_RATE;
            else if (roomType.equalsIgnoreCase("Suite"))
                ratePerNight = SUITE_RATE;

            double totalCost = nights * ratePerNight;

            System.out.println("\n=========================================");
            System.out.println("        OCEAN VIEW RESORT INVOICE");
            System.out.println("=========================================");
            System.out.println("Reservation No : " + resNum);
            System.out.println("Guest Name     : " + name);
            System.out.println("Room Type      : " + roomType);
            System.out.println("Check-in Date  : " + checkIn);
            System.out.println("Check-out Date : " + checkOut);
            System.out.println("Nights Stayed  : " + nights);
            System.out.println("Rate per Night : $" + String.format("%.2f", ratePerNight));
            System.out.println("-----------------------------------------");
            System.out.println("TOTAL COST     : $" + String.format("%.2f", totalCost));
            System.out.println("=========================================");

        } catch (Exception e) {
            System.out.println("Error calculating bill: Data format issue in the record.");
        }
    }

    private static String[] getReservation(String resNum) {
        File f = new File(RESERVATIONS_FILE);
        if (!f.exists())
            return null;

        try (BufferedReader reader = new BufferedReader(new FileReader(f))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length >= 7 && parts[0].equalsIgnoreCase(resNum)) {
                    return parts;
                }
            }
        } catch (IOException e) {
            System.out.println("Error accessing database: " + e.getMessage());
        }
        return null; // Not found
    }

    private static void printReservationCard(String[] record) {
        System.out.println("\n-----------------------------------------");
        System.out.println("           Reservation Details");
        System.out.println("-----------------------------------------");
        System.out.println("Reservation No  : " + record[0]);
        System.out.println("Guest Name      : " + record[1]);
        System.out.println("Address         : " + record[2]);
        System.out.println("Contact Number  : " + record[3]);
        System.out.println("Room Type       : " + record[4]);
        System.out.println("Check-in Date   : " + record[5]);
        System.out.println("Check-out Date  : " + record[6]);
        System.out.println("-----------------------------------------");
    }

    private static void displayHelp() {
        System.out.println("\n=========================================");
        System.out.println("               HELP SECTION");
        System.out.println("=========================================");
        System.out.println("Welcome to the Ocean View Resort System Guidelines:");
        System.out.println("\n1. Logging In:");
        System.out.println("   - The default username is 'admin' and password is 'password123'.");
        System.out.println("   - You must log in to access the system features.");
        System.out.println("\n2. Adding a Reservation:");
        System.out.println("   - Navigate to '1. Add New Reservation'.");
        System.out.println("   - Enter required details. Dates must be in YYYY-MM-DD format (e.g., 2024-05-10).");
        System.out.println("   - Check-out date must be chronologically after the Check-in date.");
        System.out.println("\n3. Display Reservation:");
        System.out.println("   - Use option 2 and provide a valid Reservation Number to view details.");
        System.out.println("\n4. Billing Calculation:");
        System.out.println("   - Use option 3. The system will auto-calculate the total based on rates:");
        System.out.println("     * Single Room : $100/night");
        System.out.println("     * Double Room : $150/night");
        System.out.println("     * Suite Room  : $250/night");
        System.out.println("\n5. Data Storage:");
        System.out.println("   - All data is securely saved in local text files ('reservations.txt').");
        System.out.println("   - User credentials are saved in ('users.txt').");
        System.out.println("=========================================");
    }
}