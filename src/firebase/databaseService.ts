// Fix: Removed v9 modular imports. v8 methods are called from the db instance.
import { db } from './firebase';
import { AppState, Course, Student } from '../types';
import type { DataSnapshot } from 'firebase/database';

// Helper to create a URL-safe key from school and grade information
const createClassKey = (school: string, grade: string) => {
    const safeSchool = school.replace(/[.#$[\]/]/g, '_');
    const safeGrade = grade.replace(/[.#$[\]/]/g, '_');
    return `${safeSchool}_${safeGrade}`;
};

// --- Data Serialization / Deserialization ---

// Firebase doesn't store Date objects, so we convert them to ISO strings
const serializeState = (state: AppState): object => {
    return {
        ...state,
        courses: state.courses.map(course => ({
            ...course,
            date: course.date.toISOString(),
        })),
    };
};

const deserializeState = (data: any): AppState => {
    const courses: Course[] = (data.courses || []).map((course: any) => ({
        ...course,
        date: new Date(course.date),
    }));
    return {
        ...data,
        courses,
    };
};

// --- Database API ---

/**
 * Saves the entire application state for a specific class to Firebase
 * and synchronizes a global student index for authentication.
 * @param school The name of the school.
 * @param grade The name of the grade/class.
 * @param state The application state to save.
 */
export const saveState = async (school: string, grade: string, state: AppState): Promise<void> => {
    try {
        const classKey = createClassKey(school, grade);

        // Fix: Replaced v9 get(ref(...)) with v8 .get() method.
        const oldStateSnapshot = await db.ref(`classData/${classKey}`).get();
        const oldStudents: Student[] = oldStateSnapshot.exists() ? deserializeState(oldStateSnapshot.val()).students : [];

        const serializableState = serializeState(state);

        const updates: Record<string, any> = {};
        updates[`/classData/${classKey}`] = serializableState;

        const oldStudentUsernames = new Set(oldStudents.map(s => s.username));
        const newStudentUsernames = new Set(state.students.map(s => s.username));

        // Clean up index for removed or username-changed students
        for (const username of oldStudentUsernames) {
            if (!newStudentUsernames.has(username)) {
                updates[`/studentIndex/${username}`] = null;
            }
        }

        // Add/update students in the global index
        for (const student of state.students) {
            updates[`/studentIndex/${student.username}`] = {
                school: school,
                grade: grade,
                password: student.password,
            };
        }
        
        // Fix: Replaced v9 update(ref(...)) with v8 .update() method.
        await db.ref().update(updates);
    } catch (error) {
        console.error("Error saving state to Firebase:", error);
        throw new Error("Failed to save data to the server.");
    }
};

/**
 * Fetches the application state once for a specific class.
 * @param school The name of the school.
 * @param grade The name of the grade/class.
 * @returns The application state, or null if it doesn't exist.
 */
export const getState = async (school: string, grade: string): Promise<AppState | null> => {
    const classKey = createClassKey(school, grade);
    // Fix: Replaced v9 ref() and get() with v8 db.ref().get().
    const dataRef = db.ref(`classData/${classKey}`);
    const snapshot = await dataRef.get();
    if (snapshot.exists()) {
        return deserializeState(snapshot.val());
    }
    return null;
};

/**
 * Fetches a student's login information (school, grade, password) from the global index.
 * @param username The student's username.
 * @returns The student's login info, or null if not found.
 */
export const getStudentLoginInfo = async (username: string): Promise<{ school: string; grade: string; password?: string } | null> => {
    // Fix: Replaced v9 ref() and get() with v8 db.ref().get().
    const dataRef = db.ref(`studentIndex/${username}`);
    const snapshot = await dataRef.get();
    if (snapshot.exists()) {
        return snapshot.val();
    }
    return null;
};


/**
 * Sets up a real-time listener for state changes for a specific class.
 * @param school The name of the school.
 * @param grade The name of the grade/class.
 * @param callback The function to call with the new state whenever data changes.
 * @returns An unsubscribe function to detach the listener.
 */
// Fix: The Unsubscribe type is not available as a named export in v8. Returning a function.
export const listenToStateChanges = (school: string, grade: string, callback: (state: AppState | null) => void): (() => void) => {
    const classKey = createClassKey(school, grade);
    // Fix: Replaced v9 ref() with v8 db.ref().
    const dataRef = db.ref(`classData/${classKey}`);

    // Fix: Replaced v9 onValue() with v8 .on() and manual unsubscribe.
    const listener = (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
            callback(deserializeState(snapshot.val()));
        } else {
            callback(null); // No data exists for this class yet
        }
    };

    const errorCallback = (error: Error) => {
        console.error("Firebase listener error:", error);
    };

    dataRef.on('value', listener, errorCallback);

    return () => dataRef.off('value', listener);
};
