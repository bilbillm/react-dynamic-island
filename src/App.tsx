import { IslandProvider, DynamicIsland, useIsland, AlarmModule, ToastModule, AudioModule } from './lib'
import type { ModuleProps } from './lib'
import { useState } from 'react'
import './App.css'

// Simple test module
const TestModule: React.FC<ModuleProps> = ({ state, onDismiss }) => {
  return (
    <div style={{ color: 'white', padding: '10px', textAlign: 'center' }}>
      <div>Test Module</div>
      <div style={{ fontSize: '12px', marginTop: '5px' }}>State: {state}</div>
      {state === 'expanded' && (
        <button 
          onClick={onDismiss}
          style={{ marginTop: '10px', padding: '5px 10px' }}
        >
          Close
        </button>
      )}
    </div>
  );
};

function AppContent() {
  const island = useIsland();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0.3);

  return (
    <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h1>Dynamic Island Demo</h1>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => island.show(TestModule, { initialState: 'compact' })}>
          Show Test Compact
        </button>
        <button onClick={() => island.show(TestModule, { initialState: 'expanded' })}>
          Show Test Expanded
        </button>
        <button onClick={() => island.show(AlarmModule as any, { 
          initialState: 'compact',
          props: { 
            duration: 60,
            onComplete: () => console.log('Alarm completed!'),
            onSnooze: (minutes: number) => console.log(`Snoozed for ${minutes} minutes`)
          }
        })}>
          Show Alarm (60s)
        </button>
        <button onClick={() => island.show(ToastModule as any, { 
          initialState: 'compact',
          props: { 
            message: 'Operation successful!',
            variant: 'success'
          }
        })}>
          Toast Success
        </button>
        <button onClick={() => island.show(ToastModule as any, { 
          initialState: 'compact',
          props: { 
            message: 'An error occurred',
            variant: 'error'
          }
        })}>
          Toast Error
        </button>
        <button onClick={() => island.show(ToastModule as any, { 
          initialState: 'compact',
          props: { 
            message: 'Warning: Please check your input',
            variant: 'warning'
          }
        })}>
          Toast Warning
        </button>
        <button onClick={() => island.show(ToastModule as any, { 
          initialState: 'compact',
          props: { 
            message: 'Information message',
            variant: 'info'
          }
        })}>
          Toast Info
        </button>
        <button onClick={() => {
          setIsPlaying(false);
          setProgress(0.3);
          island.show(AudioModule as any, { 
            initialState: 'compact',
            props: { 
              title: 'Beautiful Song',
              artist: 'Amazing Artist',
              albumCover: 'https://picsum.photos/200',
              isPlaying: isPlaying,
              progress: progress,
              onPlayPause: () => setIsPlaying(!isPlaying),
              onSeek: (pos: number) => setProgress(pos),
              onPrevious: () => console.log('Previous track'),
              onNext: () => console.log('Next track')
            }
          });
        }}>
          Show Audio Player
        </button>
        <button onClick={() => island.hide()}>
          Hide
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <p>Current State: {island.state}</p>
        <p>Is Visible: {island.isVisible ? 'Yes' : 'No'}</p>
      </div>
      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        <p>Try pressing Escape key to close the island when it's visible!</p>
        <p>Click on the island when in compact mode to expand it (if supported by module)</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <IslandProvider>
      <DynamicIsland />
      <AppContent />
    </IslandProvider>
  )
}

export default App
