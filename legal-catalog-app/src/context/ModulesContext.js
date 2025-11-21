import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import data from '../data/LegalDB.json';


const ModuleContext = createContext();


export const ModuleProvider = ({ children }) => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);

    // Función para cargar módulos desde la base de datos
    const fetchModules = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/modules');
            setModules(response.data);
        } catch (error) {
            console.error('Error fetching modules from API, using local data:', error);
            // Fallback a datos locales si el backend no está disponible
            setModules(data.modules || []);
        }
    };

    // Función para cargar cursos comprados
    const fetchPurchasedCourses = async (token) => {
        try {
            const response = await axios.get('http://localhost:5000/api/purchases/my-purchases', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const courseIds = response.data.map(purchase => purchase.curso_id);
            setPurchasedCourses(courseIds);
        } catch (error) {
            console.error('Error fetching purchased courses:', error);
            setPurchasedCourses([]);
        }
    };

    useEffect(() => {
        // Cargar módulos al iniciar
        fetchModules();

        // Verificar autenticación
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp > currentTime) {
                    setIsAuthenticated(true);
                    setUserId(decoded.id || decoded.userId);
                    
                    // Cargar cursos comprados desde la API
                    fetchPurchasedCourses(token);
                } else {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                }
            } catch {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
        setLoading(false);
    }, []);

    const purchaseCourse = async (courseId) => {
        if (!isAuthenticated || !userId) {
            return { success: false, message: 'Debes iniciar sesión para comprar cursos', needsAuth: true };
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, message: 'No se encontró token de autenticación', needsAuth: true };
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/purchases/purchase',
                { cursoId: courseId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Actualizar lista de cursos comprados
            setPurchasedCourses([...purchasedCourses, courseId]);
            
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Error al comprar el curso';
            return { success: false, message };
        }
    };

    const isPurchased = (courseId) => {
        if (!purchasedCourses || !Array.isArray(purchasedCourses)) {
            return false;
        }
        return purchasedCourses.includes(courseId);
    };


    //Modulo abierto especifico
    const openModule = async (moduleId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/modules/${moduleId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching module:', error);
            return null;
        }
    };

    


    return (
        <ModuleContext.Provider value={{ 
            modules, 
            setModules, 
            loading, 
            setLoading, 
            fetchModules,
            purchaseCourse,
            openModule,
            isPurchased,
            purchasedCourses,
            isAuthenticated,
            userId
        }} >
            {children}
        </ModuleContext.Provider>
    );
}

export default ModuleContext;