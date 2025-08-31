import { get, ref, onValue, set, Unsubscribe } from "firebase/database";
import { db } from './firebase';
import { AppState, Course } from '../types';

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
 * Saves the entire application state for a specific class to Firebase.
 * @param school The name of the school.
 * @param grade The name of the grade/class.
 * @param state The application state to save.
 */
export const saveState = async (school: string, grade: string, state: AppState): Promise<void> => {
    try {
        const classKey = createClassKey(school, grade);
        const dataRef = ref(db, `classData/${classKey}`);
        const serializableState = serializeState(state);
        await set(dataRef, serializableState);
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
    const dataRef = ref(db, `classData/${classKey}`);
    const snapshot = await get(dataRef);
    if (snapshot.exists()) {
        return deserializeState(snapshot.val());
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
export const listenToStateChanges = (school: string, grade: string, callback: (state: AppState | null) => void): Unsubscribe => {
    const classKey = createClassKey(school, grade);
    const dataRef = ref(db, `classData/${classKey}`);

    const unsubscribe = onValue(dataRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(deserializeState(snapshot.val()));
        } else {
            callback(null); // No data exists for this class yet
        }
    }, (error) => {
        console.error("Firebase listener error:", error);
    });

    return unsubscribe;
};
