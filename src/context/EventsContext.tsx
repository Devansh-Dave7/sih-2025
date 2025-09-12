import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay: boolean;
  extendedProps: {
    calendar: string;
    creatorRole: string;
  };
}

interface EventsContextType {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (event: CalendarEvent) => void;
  loadEvents: () => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

interface EventsProviderProps {
  children: ReactNode;
}

const EVENTS_STORAGE_KEY = 'shared_calendar_events';

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Load events fromlocalStorage on mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    try {
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents);
      } else {
        // Initialize with default events
        const defaultEvents: CalendarEvent[] = [
          {
            id: '1',
            title: 'Event Conf.',
            start: new Date().toISOString().split('T')[0],
            allDay: true,
            extendedProps: { calendar: 'Danger', creatorRole: 'admin' },
          },
          {
            id: '2',
            title: 'Meeting',
            start: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            allDay: true,
            extendedProps: { calendar: 'Success', creatorRole: 'hostel-warden' },
          },
          {
            id: '3',
            title: 'Workshop',
            start: new Date(Date.now() + 172800000).toISOString().split('T')[0],
            end: new Date(Date.now() + 259200000).toISOString().split('T')[0],
            allDay: true,
            extendedProps: { calendar: 'Primary', creatorRole: 'admin' },
          },
        ];
        setEvents(defaultEvents);
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(defaultEvents));
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    }
  };

  const saveEvents = (newEvents: CalendarEvent[]) => {
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newEvents));
      setEvents(newEvents);
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };

    const updatedEvents = [...events, newEvent];
    saveEvents(updatedEvents);
  };

  const updateEvent = (updatedEvent: CalendarEvent) => {
    const updatedEvents = events.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    saveEvents(updatedEvents);
  };

  const value: EventsContextType = {
    events,
    addEvent,
    updateEvent,
    loadEvents,
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};
