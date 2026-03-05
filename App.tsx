
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, NavLink, useParams, Navigate, useNavigate } from 'react-router-dom';
import { JournalProvider, useJournal, fileToMediaType } from './context/JournalContext';
import { PAGES_STRUCTURE, ButterflyIcon, SparklesIcon, PencilIcon, ShareIcon, ArrowLeftOnRectangleIcon } from './constants';
import { PageDefinition, PageField, MediaFile, MediaType, Mood, FullJournalData, Chapter, Journal } from './types';
import { generateJournalPrompt, generateAffirmations, suggestBabyNames } from './services/geminiService';

// --- Helper Functions & UI Components ---

const Spinner = ({ fullScreen = false }: { fullScreen?: boolean }) => (
    <div className={`flex justify-center items-center ${fullScreen ? 'h-screen' : ''}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A17C6B]"></div>
    </div>
);


const Card = ({ children, className, key }: { children: React.ReactNode, className?: string, key?: any }) => (
    <div key={key} className={`bg-[#FBF6F0]/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 ${className}`}>
        {children}
    </div>
);

const Input = ({ ...props }) => (
    <input
        className="w-full bg-white/50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#E5A493] focus:border-[#E5A493] outline-none transition duration-200"
        {...props}
    />
);

const Textarea = ({ ...props }) => (
    <textarea
        className="w-full bg-white/50 border border-gray-300 rounded-lg p-3 h-48 resize-y focus:ring-2 focus:ring-[#E5A493] focus:border-[#E5A493] outline-none transition duration-200"
        {...props}
    ></textarea>
);

const Button = ({ children, onClick, isLoading = false, className = '', type = 'button' }: { children: React.ReactNode, onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void, isLoading?: boolean, className?: string, type?: 'button' | 'submit' | 'reset' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 px-6 py-3 font-bold text-white bg-[#E5A493] rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
        {isLoading ? <Spinner /> : children}
    </button>
);

const FileInput = ({ onFileSelect, supportedTypes, children }: { onFileSelect: (file: File) => void, supportedTypes: MediaType[], children?: React.ReactNode }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const acceptString = supportedTypes.map(t => `${t}/*`).join(',');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onFileSelect(event.target.files[0]);
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={inputRef}
                onChange={handleChange}
                className="hidden"
                accept={acceptString}
            />
            <Button onClick={() => inputRef.current?.click()}>
                {children || 'Añadir Archivo'}
            </Button>
            <p className="text-xs text-gray-500 mt-2">Soportado: {supportedTypes.join(', ')}</p>
        </div>
    );
};


const MediaViewer = ({ media, onRemove }: { media: MediaFile[], onRemove: (id: string) => void }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {media.map(m => (
            <div key={m.id} className="relative group overflow-hidden rounded-lg shadow-md">
                {m.type === 'image' && <img src={m.data} alt={m.name} className="w-full h-32 object-cover" />}
                {m.type === 'video' && <video src={m.data} controls className="w-full h-32" />}
                {m.type === 'audio' && <audio src={m.data} controls className="w-full mt-12" />}
                <button
                    onClick={() => onRemove(m.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Eliminar"
                >
                    &times;
                </button>
            </div>
        ))}
    </div>
);


const FieldRenderer = ({ field, pageKey }: { field: PageField, pageKey: string }) => {
    const { journalData, updateEntry, addMedia, removeMedia } = useJournal();
    const entryKey = `${pageKey}_${field.key}`;
    const entry = journalData?.pageEntries[entryKey] || {};

    switch (field.type) {
        case 'text':
            return <Input value={entry.text || ''} onChange={(e) => updateEntry(entryKey, e.target.value)} placeholder={field.placeholder} />;
        case 'textarea':
            return <Textarea value={entry.text || ''} onChange={(e) => updateEntry(entryKey, e.target.value)} placeholder={field.placeholder} />;
        case 'media':
            return (
                <div>
                    <FileInput onFileSelect={(file) => addMedia(entryKey, file)} supportedTypes={field.mediaTypes || ['image', 'video', 'audio']} />
                    {entry.media && entry.media.length > 0 && <MediaViewer media={entry.media} onRemove={(id) => removeMedia(entryKey, id)} />}
                </div>
            );
        default:
            return null;
    }
};

// --- Page Components ---

const WelcomePage = () => {
    const { journalData, addMedia, removeMedia, activeJournal } = useJournal();
    const coverPhotoEntry = journalData?.pageEntries['cover_photo'] || {};
    const coverMedia = coverPhotoEntry.media?.[0];

    return (
        <div className="relative text-center flex flex-col items-center justify-center h-full p-4 overflow-hidden">
            {coverMedia && coverMedia.type === 'image' && (
                <div className="absolute inset-0 bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url(${coverMedia.data})` }}>
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-md"></div>
                </div>
            )}
            {coverMedia && coverMedia.type === 'video' && (
                <video src={coverMedia.data} autoPlay loop muted className="absolute w-auto min-w-full min-h-full max-w-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 object-cover"></video>
            )}

            <Card className="relative z-10">
                {coverMedia && coverMedia.type === 'audio' && (
                    <audio src={coverMedia.data} autoPlay loop controls className="mb-4 w-full"></audio>
                )}
                <h1 className="text-5xl font-serif text-[#A17C6B] mb-2">{activeJournal?.name || "Abriendo mis alas"}</h1>
                <p className="text-xl text-gray-600 mb-6">EMPEZANDO EL VIAJE</p>
                <p className="max-w-prose mx-auto mb-6">
                    Bienvenida a tu diario de embarazo. Un espacio sagrado para documentar este viaje de transformación.
                </p>
                <div>
                    <label className="block text-lg font-semibold text-[#5C4B44] mb-2">{coverMedia ? 'Cambiar multimedia de portada' : 'Sube una foto, video o audio de portada'}</label>
                    <FileInput onFileSelect={(file) => {
                        if (coverMedia) removeMedia('cover_photo', coverMedia.id);
                        addMedia('cover_photo', file)
                    }} supportedTypes={['image', 'video', 'audio']}>
                        {coverMedia ? 'Cambiar archivo' : 'Seleccionar archivo'}
                    </FileInput>
                    {coverMedia && <button onClick={() => removeMedia('cover_photo', coverMedia.id)} className='text-red-500 text-sm mt-2'>Eliminar multimedia</button>}
                </div>
            </Card>
        </div>
    );
};


const JournalPage = () => {
    const { chapterKey, pageKey } = useParams<{ chapterKey: string, pageKey: string }>();
    const { isInitialized } = useJournal();
    const [prompt, setPrompt] = useState('');
    const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);

    const pageDef: PageDefinition | undefined = PAGES_STRUCTURE
        .find(c => c.key === chapterKey)
        ?.pages.find(p => p.key === pageKey);

    const handleGeneratePrompt = async () => {
        if (!pageDef) return;
        setIsLoadingPrompt(true);
        const newPrompt = await generateJournalPrompt(pageDef.title);
        setPrompt(newPrompt);
        setIsLoadingPrompt(false);
    };

    if (!isInitialized) return <Spinner fullScreen />;
    if (!pageDef) return <Navigate to="/" />;

    return (
        <div className="p-4 sm:p-8">
            <h1 className="font-serif text-4xl text-[#A17C6B] mb-2">{pageDef.title}</h1>
            {pageDef.description && <p className="text-gray-600 mb-8">{pageDef.description}</p>}

            {pageDef.fields.length > 0 && (
                <Card>
                    <div className="space-y-8">
                        {pageDef.fields.map(field => (
                            <div key={field.key}>
                                <label className="block text-lg font-semibold text-[#5C4B44] mb-2">{field.label}</label>
                                <FieldRenderer field={field} pageKey={`${pageKey}`} />
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <Card className="mt-8">
                <h2 className="font-serif text-2xl text-[#A17C6B] mb-4">Inspiración para tu Diario</h2>
                <p className="mb-4">¿No sabes qué escribir? Pide una sugerencia a nuestra IA.</p>
                <Button onClick={handleGeneratePrompt} isLoading={isLoadingPrompt}>
                    <SparklesIcon className="w-5 h-5" /> Generar Sugerencia
                </Button>
                {prompt && (
                    <div className="mt-4 p-4 bg-purple-50 border-l-4 border-purple-400 text-purple-800 rounded-r-lg">
                        <p className="font-semibold italic">"{prompt}"</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

const AffirmationsPage = () => {
    const [affirmations, setAffirmations] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAffirmations = async () => {
        setIsLoading(true);
        const newAffirmations = await generateAffirmations();
        setAffirmations(newAffirmations);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAffirmations();
    }, []);

    return (
        <div className="p-4 sm:p-8">
            <h1 className="font-serif text-4xl text-[#A17C6B] mb-2">Afirmaciones Positivas</h1>
            <p className="text-gray-600 mb-8">Repite estas frases para conectar con tu poder interior.</p>
            <Button onClick={fetchAffirmations} isLoading={isLoading} className="mb-8">
                <SparklesIcon className="w-5 h-5" /> Generar Nuevas Afirmaciones
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {affirmations.map((aff, index) => (
                    <Card key={index} className="flex items-center space-x-4">
                        <ButterflyIcon className="w-8 h-8 text-[#C8A2C8] flex-shrink-0" />
                        <p className="text-lg font-medium">{aff}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};


const NameGeneratorPage = () => {
    const [gender, setGender] = useState<'niña' | 'niño' | 'cualquiera'>('cualquiera');
    const [style, setStyle] = useState('clásico y elegante');
    const [names, setNames] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNames = async () => {
        setIsLoading(true);
        const newNames = await suggestBabyNames(gender, style);
        setNames(newNames);
        setIsLoading(false);
    };

    return (
        <div className="p-4 sm:p-8">
            <h1 className="font-serif text-4xl text-[#A17C6B] mb-2">Generador de Nombres</h1>
            <p className="text-gray-600 mb-8">Encuentra el nombre perfecto para tu bebé.</p>

            <Card className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label className="block text-lg font-semibold text-[#5C4B44] mb-2">Género</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full bg-white/50 border border-gray-300 rounded-lg p-3">
                            <option value="cualquiera">Cualquiera</option>
                            <option value="niña">Niña</option>
                            <option value="niño">Niño</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-[#5C4B44] mb-2">Estilo</label>
                        <Input value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Ej: Moderno, único, de la naturaleza..." />
                    </div>
                    <Button onClick={fetchNames} isLoading={isLoading}>
                        <SparklesIcon className="w-5 h-5" /> Sugerir Nombres
                    </Button>
                </div>
            </Card>

            {names.length > 0 && (
                <Card>
                    <h2 className="font-serif text-2xl text-[#A17C6B] mb-4">Sugerencias:</h2>
                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {names.map((name, i) => (
                            <li key={i} className="bg-white/70 p-3 rounded-lg text-center font-semibold text-lg shadow">
                                {name}
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
        </div>
    )
}

// --- Personal Diary Components ---

const MOOD_OPTIONS: { value: Mood, emoji: string, label: string }[] = [
    { value: 'excelente', emoji: '😍', label: 'Excelente' },
    { value: 'muy-feliz', emoji: '😄', label: 'Muy Feliz' },
    { value: 'feliz', emoji: '😊', label: 'Feliz' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'triste', emoji: '😔', label: 'Triste' },
];

const SYMPTOM_OPTIONS = ['Náuseas', 'Cansancio', 'Antojos', 'Dolor de espalda', 'Hinchazón'];

const PersonalDiaryHistoryPage = () => {
    const { journalData, removePersonalDiaryEntry } = useJournal();

    const sortedEntries = [...(journalData?.personalDiaryEntries || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="font-serif text-4xl text-[#A17C6B]">Historial del Diario</h1>
                    <p className="text-gray-600">Aquí están todas tus entradas personales.</p>
                </div>
                <NavLink to="/diario-personal/nueva-entrada" className="shrink-0">
                    <Button>Nueva Entrada</Button>
                </NavLink>
            </div>

            {sortedEntries.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-lg font-semibold text-gray-700">Aún no has escrito ninguna entrada en tu diario.</p>
                    <p className="text-gray-500 mt-2">¡Es un buen momento para empezar a capturar tus momentos!</p>
                </Card>
            ) : (
                <div className="space-y-6">
                    {sortedEntries.map(entry => (
                        <Card key={entry.id} className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-grow">
                                <span className="font-bold text-base text-purple-700">{new Date(entry.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <h2 className="font-serif text-2xl text-[#A17C6B] mt-1">{entry.title}</h2>
                                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{entry.text}</p>
                                <div className="mt-3 flex items-center gap-4 text-sm">
                                    <span className="text-2xl" title={`Estado de ánimo: ${MOOD_OPTIONS.find(m => m.value === entry.mood)?.label}`}>
                                        {MOOD_OPTIONS.find(m => m.value === entry.mood)?.emoji}
                                    </span>
                                    {entry.symptoms.length > 0 && <span className="text-gray-500 hidden sm:block">Síntomas: {entry.symptoms.join(', ')}</span>}
                                </div>
                                {entry.media && entry.media.length > 0 && (
                                    <div className="mt-4">
                                        <MediaViewer media={entry.media} onRemove={() => { }} />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 shrink-0 mt-4 sm:mt-0 self-start sm:self-center">
                                <NavLink to={`/diario-personal/editar/${entry.id}`}>
                                    <Button className="!px-4 !py-2 bg-blue-500/80 hover:bg-blue-500">Editar</Button>
                                </NavLink>
                                <Button onClick={() => window.confirm('¿Estás segura de que quieres eliminar esta entrada?') && removePersonalDiaryEntry(entry.id)} className="!px-4 !py-2 bg-red-500/80 hover:bg-red-500">
                                    Eliminar
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

const PersonalDiaryEntryPage = () => {
    const { entryId } = useParams<{ entryId: string }>();
    const navigate = useNavigate();
    const { journalData, addPersonalDiaryEntry, updatePersonalDiaryEntry } = useJournal();

    const isEditing = Boolean(entryId);
    const existingEntry = isEditing ? journalData?.personalDiaryEntries.find(e => e.id === entryId) : undefined;

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [mood, setMood] = useState<Mood>('feliz');
    const [weight, setWeight] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [otherSymptom, setOtherSymptom] = useState('');
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

    useEffect(() => {
        if (existingEntry) {
            setDate(existingEntry.date);
            setTitle(existingEntry.title);
            setText(existingEntry.text);
            setMood(existingEntry.mood);
            setWeight(existingEntry.weight || '');
            setBloodPressure(existingEntry.bloodPressure || '');
            const knownSymptoms = existingEntry.symptoms.filter(s => SYMPTOM_OPTIONS.includes(s));
            const other = existingEntry.symptoms.find(s => !SYMPTOM_OPTIONS.includes(s));
            setSymptoms(knownSymptoms);
            if (other) setOtherSymptom(other);
            setMediaFiles(existingEntry.media || []);
        }
    }, [existingEntry]);

    const handleSymptomChange = (symptom: string) => {
        setSymptoms(prev =>
            prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
        );
    };

    const handleAddMedia = (file: File) => {
        const mediaType = fileToMediaType(file);
        if (!mediaType) {
            alert('Tipo de archivo no soportado.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Data = event.target?.result as string;
            if (base64Data) {
                const newMedia: MediaFile = {
                    id: `media-${Date.now()}`,
                    name: file.name,
                    type: mediaType,
                    data: base64Data,
                };
                setMediaFiles(prev => [...prev, newMedia]);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveMedia = (mediaId: string) => {
        setMediaFiles(prev => prev.filter(m => m.id !== mediaId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalSymptoms = [...symptoms];
        if (otherSymptom.trim()) {
            finalSymptoms.push(otherSymptom.trim());
        }

        const entryData = { date, title, text, symptoms: finalSymptoms, mood, weight, bloodPressure, media: mediaFiles };

        if (isEditing && existingEntry) {
            updatePersonalDiaryEntry({ ...entryData, id: existingEntry.id });
        } else {
            addPersonalDiaryEntry(entryData);
        }
        navigate('/diario-personal/historial');
    };

    return (
        <div className="p-4 sm:p-8">
            <h1 className="font-serif text-4xl text-[#A17C6B] mb-8">{isEditing ? 'Editar Entrada del Diario' : 'Nueva Entrada del Diario'}</h1>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-lg font-semibold text-[#5C4B44] mb-2">Fecha</label>
                            <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-[#5C4B44] mb-2">Título</label>
                            <Input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Un día para recordar" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-[#5C4B44] mb-2">Mis sentimientos y experiencias de hoy</label>
                        <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="¿Qué pasó hoy? ¿Cómo te sientes?" required />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-[#5C4B44] mb-2">Añadir Fotos, Videos o Audio</label>
                        <FileInput onFileSelect={handleAddMedia} supportedTypes={['image', 'video', 'audio']} />
                        {mediaFiles.length > 0 && <MediaViewer media={mediaFiles} onRemove={handleRemoveMedia} />}
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-[#5C4B44] mb-2">¿Cómo te sientes emocionalmente?</label>
                        <div className="flex justify-around items-center p-4 bg-white/50 rounded-lg">
                            {MOOD_OPTIONS.map(({ value, emoji, label }) => (
                                <button type="button" key={value} onClick={() => setMood(value)} className={`p-2 rounded-full transition-all duration-200 ${mood === value ? 'bg-[#E5A493] scale-125' : 'hover:bg-gray-200'}`} title={label}>
                                    <span className="text-3xl">{emoji}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-[#5C4B44] mb-2">Síntomas de hoy</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-white/50 rounded-lg">
                            {SYMPTOM_OPTIONS.map(symptom => (
                                <label key={symptom} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={symptoms.includes(symptom)} onChange={() => handleSymptomChange(symptom)} className="w-5 h-5 rounded text-[#E5A493] focus:ring-[#C8A2C8]" />
                                    {symptom}
                                </label>
                            ))}
                            <div className="sm:col-span-3">
                                <Input type="text" value={otherSymptom} onChange={e => setOtherSymptom(e.target.value)} placeholder="Otro síntoma..." />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-lg font-semibold text-[#5C4B44] mb-2">Peso (opcional)</label>
                            <div className="relative">
                                <Input type="text" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Ej: 65.5" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">kg</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-[#5C4B44] mb-2">Presión Arterial (opcional)</label>
                            <div className="relative">
                                <Input type="text" value={bloodPressure} onChange={e => setBloodPressure(e.target.value)} placeholder="Ej: 120/80" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">mmHg</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit">{isEditing ? 'Actualizar Entrada' : 'Guardar Entrada'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

// --- Share Feature Components & Logic ---

const generateShareableHtml = (journalData: FullJournalData, journalName: string, selectedSections: string[]): string => {
    const { pageEntries, personalDiaryEntries } = journalData;
    let content = '';

    const sortedChapters = PAGES_STRUCTURE.filter(c => selectedSections.includes(c.key));

    sortedChapters.forEach(chapter => {
        content += `<h2 class="chapter-title">${chapter.title}</h2>`;
        chapter.pages.forEach(page => {
            let pageContent = '';
            page.fields.forEach(field => {
                const entryKey = `${page.key}_${field.key}`;
                const entry = pageEntries[entryKey];
                if (entry) {
                    if (entry.text) {
                        pageContent += `<div class="entry-block"><h3>${field.label}</h3><p>${entry.text.replace(/\n/g, '<br>')}</p></div>`;
                    }
                    if (entry.media) {
                        entry.media.forEach(m => {
                            if (m.type === 'image') pageContent += `<img src="${m.data}" alt="${m.name}" class="media-item">`;
                            if (m.type === 'video') pageContent += `<video src="${m.data}" controls class="media-item"></video>`;
                            if (m.type === 'audio') pageContent += `<audio src="${m.data}" controls></audio>`;
                        });
                    }
                }
            });
            if (pageContent) {
                content += `<div class="page-card"><h3>${page.title}</h3>${pageContent}</div>`;
            }
        });
    });

    if (selectedSections.includes('personal-diary')) {
        content += `<h2 class="chapter-title">Diario Personal</h2>`;
        const sortedEntries = [...personalDiaryEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        sortedEntries.forEach(entry => {
            content += `<div class="page-card">
                <p class="diary-date">${new Date(entry.date + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h3>${entry.title}</h3>
                <p>${entry.text.replace(/\n/g, '<br>')}</p>
                <div class="diary-meta">
                    <span>Ánimo: ${MOOD_OPTIONS.find(m => m.value === entry.mood)?.emoji || 'N/A'}</span>
                    ${entry.symptoms.length > 0 ? `<span>Síntomas: ${entry.symptoms.join(', ')}</span>` : ''}
                    ${entry.weight ? `<span>Peso: ${entry.weight} kg</span>` : ''}
                    ${entry.bloodPressure ? `<span>Presión: ${entry.bloodPressure} mmHg</span>` : ''}
                </div>`;
            if (entry.media) {
                entry.media.forEach(m => {
                    if (m.type === 'image') content += `<img src="${m.data}" alt="${m.name}" class="media-item">`;
                    if (m.type === 'video') content += `<video src="${m.data}" controls class="media-item"></video>`;
                    if (m.type === 'audio') content += `<audio src="${m.data}" controls></audio>`;
                });
            }
            content += `</div>`;
        });
    }

    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${journalName}</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FDFBF8; color: #5C4B44; margin: 0; padding: 2rem; }
                .container { max-width: 800px; margin: auto; }
                h1 { font-family: 'Times New Roman', Times, serif; font-size: 3rem; color: #A17C6B; text-align: center; }
                .chapter-title { font-family: 'Times New Roman', Times, serif; font-size: 2.5rem; color: #A17C6B; border-bottom: 2px solid #E5A493; padding-bottom: 0.5rem; margin-top: 3rem; }
                .page-card { background: #fff; border-radius: 12px; padding: 1.5rem; margin-top: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                h3 { font-family: 'Times New Roman', Times, serif; font-size: 1.5rem; color: #A17C6B; margin-top: 0; }
                p { line-height: 1.6; }
                .media-item { max-width: 100%; border-radius: 8px; margin-top: 1rem; }
                video, audio { width: 100%; margin-top: 1rem; }
                .diary-date { font-size: 0.9rem; color: #8a6c62; font-weight: bold; }
                .diary-meta { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem; font-size: 0.9rem; color: #555; }
            </style>
        </head>
        <body><div class="container"><h1>${journalName}</h1>${content}</div></body>
        </html>
    `;
};

const ShareModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { journalData, activeJournal } = useJournal();
    const [selected, setSelected] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const allKeys = [...PAGES_STRUCTURE.map(c => c.key), 'personal-diary'];
            setSelected(allKeys);
        }
    }, [isOpen]);

    const handleToggle = (key: string) => {
        setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };

    const handleSelectAll = () => {
        const allKeys = [...PAGES_STRUCTURE.map(c => c.key), 'personal-diary'];
        setSelected(allKeys);
    }

    const handleDeselectAll = () => {
        setSelected([]);
    }

    const handleGenerate = () => {
        if (!activeJournal || !journalData) return;
        setIsGenerating(true);
        try {
            const htmlContent = generateShareableHtml(journalData, activeJournal.name, selected);
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${activeJournal.name.toLowerCase().replace(/ /g, '-')}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            onClose();
        } catch (e) {
            console.error("Error generating file:", e);
            alert("Hubo un error al generar el archivo.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#FBF6F0] rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="font-serif text-3xl text-[#A17C6B] mb-4">Compartir Diario</h2>
                <p className="text-gray-600 mb-6">Selecciona las secciones que quieres incluir en el archivo HTML descargable.</p>
                <div className="flex gap-4 mb-4">
                    <button onClick={handleSelectAll} className="text-sm text-blue-600">Seleccionar todo</button>
                    <button onClick={handleDeselectAll} className="text-sm text-blue-600">Deseleccionar todo</button>
                </div>
                <div className="space-y-3">
                    {PAGES_STRUCTURE.map(chapter => (
                        <label key={chapter.key} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg cursor-pointer">
                            <input type="checkbox" checked={selected.includes(chapter.key)} onChange={() => handleToggle(chapter.key)} className="w-5 h-5 rounded text-[#E5A493] focus:ring-[#C8A2C8]" />
                            <chapter.icon className="w-5 h-5 text-gray-600" />
                            <span>{chapter.title}</span>
                        </label>
                    ))}
                    <label key="personal-diary" className="flex items-center gap-3 p-3 bg-white/50 rounded-lg cursor-pointer">
                        <input type="checkbox" checked={selected.includes('personal-diary')} onChange={() => handleToggle('personal-diary')} className="w-5 h-5 rounded text-[#E5A493] focus:ring-[#C8A2C8]" />
                        <PencilIcon className="w-5 h-5 text-gray-600" />
                        <span>Diario Personal</span>
                    </label>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                    <Button onClick={onClose} className="bg-gray-400 hover:bg-gray-500">Cancelar</Button>
                    <Button onClick={handleGenerate} isLoading={isGenerating}>Generar y Descargar</Button>
                </div>
            </div>
        </div>
    );
};


// --- Layout & Main App ---

const Sidebar = ({ isOpen, setIsOpen, onShareClick, onLogout, journalName }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void, onShareClick: () => void, onLogout: () => void, journalName: string }) => {
    const activeLinkStyle = {
        backgroundColor: '#E5A493',
        color: 'white',
    };

    return (
        <>
            <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-[#FBF6F0] border-r border-gray-200 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 flex flex-col`}>
                <div className="p-4 border-b border-gray-200 flex flex-col items-center gap-2">
                    <span className="font-serif text-4xl tracking-[0.1em] text-[#A17C6B] uppercase">amyo</span>
                    <h2 className="font-serif text-xl text-[#A17C6B] truncate w-full text-center" title={journalName}>{journalName}</h2>
                </div>
                <nav className="p-2 space-y-2 overflow-y-auto flex-grow h-[calc(100vh-180px)]">
                    {PAGES_STRUCTURE.map(chapter => (
                        <div key={chapter.key}>
                            <h3 className="px-2 py-2 text-sm font-bold uppercase text-gray-500 flex items-center gap-2">
                                <chapter.icon className="w-5 h-5" />
                                {chapter.title}
                            </h3>
                            <ul className="ml-2 border-l border-gray-200">
                                {chapter.pages.map(page => (
                                    <li key={page.key}>
                                        <NavLink
                                            to={`/${chapter.key}/${page.key}`}
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
                                            style={({ isActive }) => isActive ? activeLinkStyle : {}}
                                        >
                                            {page.title}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div>
                        <h3 className="px-2 py-2 text-sm font-bold uppercase text-gray-500 flex items-center gap-2"><SparklesIcon className="w-5 h-5" />Herramientas IA</h3>
                        <ul className="ml-2 border-l border-gray-200">
                            <li><NavLink to="/ai/affirmations" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-200 transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : {}}>Afirmaciones</NavLink></li>
                            <li><NavLink to="/ai/names" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-200 transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : {}}>Nombres de Bebé</NavLink></li>
                        </ul>
                    </div>
                </nav>
                <div className="p-4 border-t border-gray-200 space-y-2">
                    <button onClick={onShareClick} className="w-full flex items-center justify-center gap-2 px-4 py-2 font-bold text-[#A17C6B] bg-white/50 rounded-lg hover:bg-[#E5A493]/50 transition-colors">
                        <ShareIcon className="w-5 h-5" />
                        Compartir
                    </button>
                    <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 font-bold text-gray-600 bg-white/50 rounded-lg hover:bg-gray-200 transition-colors">
                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                        Cambiar de Diario
                    </button>
                </div>
            </aside>
            {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/50 z-30 md:hidden"></div>}
        </>
    );
};


const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const { lockJournal, activeJournal } = useJournal();

    if (!activeJournal) return <Navigate to="/" />;

    return (
        <div className="flex h-screen bg-[#FDFBF8]">
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                onShareClick={() => setIsShareModalOpen(true)}
                onLogout={lockJournal}
                journalName={activeJournal.name}
            />
            <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
            <main className="flex-1 overflow-y-auto">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden fixed top-4 left-4 z-20 p-2 bg-[#FBF6F0] rounded-md shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/diario-personal/nueva-entrada" element={<PersonalDiaryEntryPage />} />
                    <Route path="/diario-personal/historial" element={<PersonalDiaryHistoryPage />} />
                    <Route path="/diario-personal/editar/:entryId" element={<PersonalDiaryEntryPage />} />
                    <Route path="/ai/affirmations" element={<AffirmationsPage />} />
                    <Route path="/ai/names" element={<NameGeneratorPage />} />
                    <Route path="/:chapterKey/:pageKey" element={<JournalPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </div>
    );
};

const PasswordPromptModal = ({ journal, onUnlock, onCancel, onSetPassword }: { journal: Journal, onUnlock: (password: string) => boolean, onCancel: () => void, onSetPassword: (password: string) => void }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const needsToSetPassword = !journal.isEncrypted;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (needsToSetPassword) {
            if (password !== confirmPassword) {
                setError('Las contraseñas no coinciden.');
                return;
            }
            if (password.length < 6) {
                setError('Para mayor seguridad, usa al menos 6 caracteres.');
                return;
            }
            // Validación básica de complejidad: al menos una letra y un número
            if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(password)) {
                setError('Te sugerimos usar una combinación de letras y números.');
                return;
            }
            onSetPassword(password);
        } else {
            const success = onUnlock(password);
            if (!success) {
                setError('Contraseña incorrecta. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <h2 className="font-serif text-2xl text-[#A17C6B] mb-2">{needsToSetPassword ? 'Crear Contraseña' : 'Introduce la Contraseña'}</h2>
                <p className="text-gray-600 mb-4">
                    {needsToSetPassword
                        ? `Para proteger tu diario "${journal.name}", crea una contraseña segura. Nadie más podrá acceder sin ella.`
                        : `Para abrir el diario "${journal.name}".`}
                </p>
                {needsToSetPassword && (
                    <div className="bg-[#E5A493]/10 p-3 rounded-lg mb-4 text-xs text-[#A17C6B] border border-[#E5A493]/20">
                        <strong>Consejo de Seguridad:</strong> Tus datos se guardan cifrados localmente. Una contraseña fuerte (letras y números) asegura que tu privacidad esté protegida al 100%.
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#5C4B44] mb-1">Contraseña</label>
                        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoFocus />
                    </div>
                    {needsToSetPassword && (
                        <div>
                            <label className="block text-sm font-semibold text-[#5C4B44] mb-1">Confirmar Contraseña</label>
                            <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                        </div>
                    )}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end gap-4 pt-2">
                        <Button type="button" onClick={onCancel} className="bg-gray-400 hover:bg-gray-500">Cancelar</Button>
                        <Button type="submit">{needsToSetPassword ? 'Guardar y Abrir' : 'Abrir'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};


const JournalSelectionScreen = () => {
    const { allJournals, unlockJournal, createJournal, setJournalPassword } = useJournal();
    const [newJournalName, setNewJournalName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLowEntropyWarning, setIsLowEntropyWarning] = useState(false);
    const [unlockingJournal, setUnlockingJournal] = useState<Journal | null>(null);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        if (newPassword.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        // Verificación de entropía (letras y números)
        const isSecure = /^(?=.*[A-Za-z])(?=.*\d).+$/.test(newPassword);
        if (!isSecure && !isLowEntropyWarning) {
            setError("Tu contraseña es sencilla. Recomendamos usar letras y números para mayor seguridad. Pulsa nuevamente 'Crear' si deseas continuar de todos modos.");
            setIsLowEntropyWarning(true);
            return;
        }

        console.log("Creando diario:", newJournalName);
        createJournal(newJournalName, newPassword);
        setNewJournalName('');
        setNewPassword('');
        setConfirmPassword('');
        setIsLowEntropyWarning(false);
    };

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if (error) setError('');
        if (isLowEntropyWarning) setIsLowEntropyWarning(false);
    };

    return (
        <>
            {unlockingJournal && (
                <PasswordPromptModal
                    journal={unlockingJournal}
                    onUnlock={(password) => unlockJournal(unlockingJournal.id, password)}
                    onCancel={() => setUnlockingJournal(null)}
                    onSetPassword={(password) => setJournalPassword(unlockingJournal.id, password)}
                />
            )}
            <div className="min-h-screen bg-[#FDFBF8] flex items-center justify-center p-4">
                <Card className="w-full max-w-lg text-center">
                    <span className="block font-serif text-5xl tracking-[0.2em] text-[#A17C6B] uppercase mb-6">amyo</span>
                    <h1 className="font-serif text-4xl text-[#A17C6B] mb-2">Diario de Embarazo: Abriendo Mis Alas</h1>
                    <p className="text-gray-500 italic mb-6">por Mami Cary</p>
                    <p className="text-gray-600 mb-8">Bienvenida. Selecciona tu diario o crea uno nuevo para empezar.</p>

                    {Object.keys(allJournals).length > 0 && (
                        <div className="mb-8">
                            <h2 className="font-serif text-2xl text-[#A17C6B] mb-4">Mis Diarios</h2>
                            <div className="space-y-3">
                                {Object.values(allJournals).map(journal => (
                                    <button key={journal.id} onClick={() => setUnlockingJournal(journal)} className="w-full text-lg text-center p-4 bg-white/60 rounded-lg shadow-sm hover:bg-[#E5A493]/30 transition-colors font-semibold">
                                        {journal.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 className="font-serif text-2xl text-[#A17C6B] mb-4">Crear un Nuevo Diario</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <Input
                                type="text"
                                value={newJournalName}
                                onChange={handleInputChange(setNewJournalName)}
                                placeholder="Ej: El Viaje de María"
                                required
                            />
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={handleInputChange(setNewPassword)}
                                placeholder="Contraseña"
                                required
                            />
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={handleInputChange(setConfirmPassword)}
                                placeholder="Confirmar Contraseña"
                                required
                            />
                            {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
                            <Button type="submit" className="w-full">Crear Diario Seguro</Button>
                        </form>

                    </div>
                </Card>
            </div>
        </>
    );
};

const AppGate = () => {
    const { activeJournal, isInitialized } = useJournal();

    if (!isInitialized) {
        return <Spinner fullScreen />;
    }

    if (activeJournal) {
        return <MainLayout />;
    }

    return <JournalSelectionScreen />;
};

function App() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js').then(registration => {
                    console.log('SW registered: ', registration);
                }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
            });
        }
    }, []);

    return (
        <JournalProvider>
            <HashRouter>
                <AppGate />
            </HashRouter>
        </JournalProvider>
    );
}

export default App;
