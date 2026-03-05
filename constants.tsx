
import React from 'react';
import { Chapter } from './types';

export const ButterflyIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.221 10.825c-.234-.502.071-1.12.639-1.343.567-.224 1.192.05 1.426.551l3.58 7.65c.234.501-.071 1.12-.639 1.343-.567.223-1.192-.05-1.426-.551l-3.58-7.65zM11.779 10.825c.234-.502-.071-1.12-.639-1.343-.567-.224-1.192.05-1.426.551l-3.58 7.65c-.234.501.071 1.12.639 1.343.567.223 1.192-.05 1.426-.551l3.58-7.65z" />
        <path d="M14.285 3.966c.567.223 1.192-.05 1.426-.551l1.543-3.297c.234-.502-.071-1.12-.639-1.343C16.05-.15 15.425.124 15.19.626L13.647 3.923c-.234.501.071 1.12.639 1.343h-.001zM9.715 3.966c-.567.223-1.192-.05-1.426-.551L6.746.118C6.512-.383 5.887-.109 5.652.114 5.085.337 4.78.956 5.014 1.457l1.543 3.297c.234.501.859.775 1.426.551h.001zM12 9.5c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" />
    </svg>
);

export const HomeIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

export const BookOpenIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
);

export const HeartIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);

export const SparklesIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

export const CameraIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
);

export const PencilIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

export const ShareIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 4.184 2.25 2.25 0 0 0 0-4.184Zm0 0a2.25 2.25 0 1 1 0 4.184 2.25 2.25 0 0 1 0-4.184Zm0 0a2.25 2.25 0 1 0 0 4.184 2.25 2.25 0 0 0 0-4.184Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.878 4.801a2.25 2.25 0 1 0 0 4.184 2.25 2.25 0 0 0 0-4.184Zm0 0a2.25 2.25 0 1 1 0 4.184 2.25 2.25 0 0 1 0-4.184Zm0 0a2.25 2.25 0 1 0 0 4.184 2.25 2.25 0 0 0 0-4.184Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.15a2.25 2.25 0 1 0 0-4.184 2.25 2.25 0 0 0 0 4.184Zm0 0a2.25 2.25 0 1 1 0-4.184 2.25 2.25 0 0 1 0-4.184Zm0 0a2.25 2.25 0 1 0 0-4.184 2.25 2.25 0 0 0 0 4.184Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.254 6.425a.75.75 0 0 1 .016 1.06l-4.128 4.128a.75.75 0 0 1-1.076 0L4.938 7.485a.75.75 0 0 1 .016-1.06l.008-.008a.75.75 0 0 1 1.06.016l3.575 3.575 3.567-3.567a.75.75 0 0 1 1.06.016l.008.008Zm-2.122 9.192a.75.75 0 0 1 .016 1.06l-2.064 2.064a.75.75 0 0 1-1.076 0l-2.064-2.064a.75.75 0 0 1 .016-1.06l.008-.008a.75.75 0 0 1 1.06.016l1.497 1.497 1.497-1.497a.75.75 0 0 1 1.06.016l.008.008Z" />
    </svg>
);

export const ArrowLeftOnRectangleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H21" />
    </svg>
);

export const BackupIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
    </svg>
);

export const QuestionMarkCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
    </svg>
);


export const PAGES_STRUCTURE: Chapter[] = [
    {
        key: 'introduccion',
        title: 'Introducción',
        icon: HomeIcon,
        pages: [
            {
                key: 'hola-mama',
                title: 'Hola Mamá',
                description: "Unas palabras de bienvenida a este mágico viaje.",
                fields: [
                    { key: 'mensaje', label: 'Escribe aquí tu mensaje de bienvenida:', type: 'textarea', placeholder: 'Querida mamá, este es el comienzo de...' }
                ]
            },
            {
                key: 'hola-bebe',
                title: 'Hola Bebé',
                description: "Un mensaje lleno de amor para quien está en camino.",
                fields: [
                    { key: 'mensaje', label: 'Escribe aquí tu mensaje para el bebé:', type: 'textarea', placeholder: 'Pequeño/a, estamos esperándote con...' }
                ]
            },
        ],
    },
    {
        key: 'espera-y-preparacion',
        title: 'Espera y Preparación',
        icon: BookOpenIcon,
        pages: [
            {
                key: 'el-dia-que-supimos',
                title: 'El día que supimos de ti...',
                description: 'Registra el momento exacto en que supiste que tu vida cambiaría para siempre.',
                fields: [
                    { key: 'fecha', label: 'Fecha en que nos enteramos que venías en camino:', type: 'text' },
                    { key: 'edad-mama', label: 'Edad de mamá en ese momento:', type: 'text' },
                    { key: 'edad-papa', label: 'Edad de papá en ese momento:', type: 'text' },
                    { key: 'sentimientos', label: '¿Cómo nos sentimos al recibir la noticia?:', type: 'textarea', placeholder: 'Describe tus emociones, pensamientos y reacciones...' },
                    { key: 'primer-pensamiento', label: '¿Qué fue lo primero que pensamos o dijimos?:', type: 'textarea' },
                    { key: 'fecha-estimada', label: 'Fecha estimada de tu llegada al mundo:', type: 'text' },
                    { key: 'recuerdo-especial', label: 'Algo que queremos recordarte de ese momento:', type: 'textarea' },
                    { key: 'foto-prueba', label: 'Foto de la prueba de embarazo', type: 'media', mediaTypes: ['image'] },
                ],
            },
            {
                key: 'carta-mama',
                title: 'Carta para ti, bebé (de Mamá)',
                description: 'Escribe una carta a tu bebé, llénala de amor, sueños y promesas.',
                fields: [
                    { key: 'carta', label: 'Querido bebé...', type: 'textarea', placeholder: 'Escribe tus sentimientos aquí...' },
                    { key: 'media', label: 'Añade un audio o video con tu mensaje', type: 'media', mediaTypes: ['audio', 'video'] },
                ]
            },
            {
                key: 'carta-papa',
                title: 'Carta para ti, bebé (de Papá)',
                description: 'Un espacio para que papá también comparta sus sentimientos y esperanzas.',
                fields: [
                    { key: 'carta', label: 'Querido bebé...', type: 'textarea', placeholder: 'Escribe tus sentimientos aquí...' },
                    { key: 'media', label: 'Añade un audio o video con tu mensaje', type: 'media', mediaTypes: ['audio', 'video'] },
                ]
            },
            {
                key: 'nombres-favoritos',
                title: 'Lista de Nombres Favoritos',
                description: '¿Qué nombres están considerando? ¡Anótalos aquí!',
                fields: [
                    { key: 'nombres-nina', label: 'Nombres para Niña', type: 'textarea', placeholder: 'Sofía, Valentina, Isabella...' },
                    { key: 'nombres-nino', label: 'Nombres para Niño', type: 'textarea', placeholder: 'Mateo, Santiago, Sebastián...' },
                ]
            }
        ],
    },
    {
        key: 'cuidados-y-bienestar',
        title: 'Cuidados y Bienestar',
        icon: HeartIcon,
        pages: [
            {
                key: 'afirmaciones',
                title: 'Mis Afirmaciones',
                description: 'Frases poderosas para conectar contigo y tu bebé.',
                fields: [
                    { key: 'mis-afirmaciones', label: 'Escribe tus propias afirmaciones', type: 'textarea', placeholder: 'Ej: Confío en mi cuerpo y en mi capacidad para dar a luz...' },
                ]
            },
            {
                key: 'antojos',
                title: 'Mis Antojos',
                description: 'Los antojos más raros y ricos del embarazo.',
                fields: [
                    { key: 'antojos-ricos', label: 'Describe tus antojos', type: 'textarea', placeholder: 'Chocolate con pepinillos, helado a media noche...' },
                    { key: 'foto-antojo', label: 'Foto de tu antojo más memorable', type: 'media', mediaTypes: ['image'] },
                ]
            },
        ],
    },
    {
        key: 'celebraciones',
        title: 'Celebraciones',
        icon: SparklesIcon,
        pages: [
            {
                key: 'gender-reveal',
                title: 'Gender Reveal',
                description: 'El emocionante momento de descubrir si es niño o niña.',
                fields: [
                    { key: 'fecha-lugar', label: '¿Cuándo y dónde fue?', type: 'text' },
                    { key: 'reaccion', label: 'Describe cómo fue la revelación y las reacciones', type: 'textarea' },
                    { key: 'fotos-videos', label: 'Fotos y Videos del Gender Reveal', type: 'media', mediaTypes: ['image', 'video'] },
                ]
            },
            {
                key: 'baby-shower',
                title: 'Baby Shower',
                description: 'Recuerdos de la fiesta de bienvenida para el bebé.',
                fields: [
                    { key: 'fecha-lugar', label: '¿Cuándo y dónde fue?', type: 'text' },
                    { key: 'recuerdos', label: 'Momentos especiales, juegos y regalos', type: 'textarea' },
                    { key: 'fotos-videos', label: 'Fotos y Videos del Baby Shower', type: 'media', mediaTypes: ['image', 'video'] },
                ]
            },
        ],
    },
    {
        key: 'diario-personal',
        title: 'Diario Personal',
        icon: PencilIcon,
        pages: [
            {
                key: 'nueva-entrada',
                title: 'Nueva Entrada',
                description: 'Crea una nueva entrada en tu diario personal.',
                fields: []
            },
            {
                key: 'historial',
                title: 'Historial',
                description: 'Revisa todas tus entradas pasadas.',
                fields: []
            }
        ]
    },
    {
        key: 'trimestres',
        title: 'Trimestres',
        icon: CameraIcon,
        pages: [
            {
                key: 'primer-trimestre',
                title: 'Primer Trimestre',
                description: 'Los primeros cambios, emociones y descubrimientos.',
                fields: [
                    { key: 'sensaciones', label: 'Cambios, energía y emociones', type: 'textarea' },
                    { key: 'fotos-eco', label: 'Fotos del primer trimestre y ecografías', type: 'media', mediaTypes: ['image'] },
                ]
            },
            {
                key: 'segundo-trimestre',
                title: 'Segundo Trimestre',
                description: 'La pancita crece y sientes los primeros movimientos.',
                fields: [
                    { key: 'sensaciones', label: 'Crecimiento de la pancita, pataditas y momentos importantes', type: 'textarea' },
                    { key: 'fotos-eco', label: 'Fotos del segundo trimestre y ecografías', type: 'media', mediaTypes: ['image'] },
                ]
            },
            {
                key: 'tercer-trimestre',
                title: 'Tercer Trimestre',
                description: 'La recta final, preparándote para el gran día.',
                fields: [
                    { key: 'sensaciones', label: 'Preparativos, miedos y deseos para el parto', type: 'textarea' },
                    { key: 'fotos-eco', label: 'Fotos del tercer trimestre y ecografías', type: 'media', mediaTypes: ['image'] },
                ]
            }
        ]
    }
];
