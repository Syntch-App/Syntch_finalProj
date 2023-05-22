import { useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
// import useAuthUser from '../../auth/hooks/useAuthUser';
import { GameContext } from '../Context/GameContext';
import './LevelSelector.css';

function LevelSelector() {
  const {
    setData,
    selectedLevel,
    setSelectedLevel,
    currentTaskIndex,
    setCurrentTaskIndex,
    setCurrentTask,
    setExerciseGenerated,
    setBlanks,
    setNumBlanks,
    setShowSnippet,
    setTaskAccepted,
    resetTimer,
    setDelay,
    setOpacity,
    setTimerVisible,
    setCountdownVisible,
    setDefaultPoints,
    setSubmitClicked,
    setLevelBtnClass,
    levelBtnClass,
    levelBtnStyle,
    setUserAnswer,
    // totalTasks,
    setTotalTasks
  } = useContext(GameContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/level/tasks`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
            // Authorization: `Bearer ${authUser.accessToken}`
          },
          body: JSON.stringify({ name: selectedLevel })
        });
        const data = await response.json();
        console.log(data);
        // console.log(data[selectedLevel]);
        setData(data);
        // console.log(data.beginner.length);
        if (selectedLevel) {
          setDelay(data.timerCount); // countdown value
          setNumBlanks(data.blanksCount); // input fields number
          setDefaultPoints(data.defaultPoints);
          setCurrentTask(data.tasks[currentTaskIndex]);
          setTotalTasks(data.tasks.length);
          // console.log(currentTaskIndex);
          // console.log('SL:', selectedLevel.length);
          // console.log(totalTasks);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [selectedLevel, currentTaskIndex]);

  const defaultBgColor = '#90caf9';

  function handleLevelChange(level) {
    // console.log('Level changed to', level);
    setCurrentTaskIndex(0);
    setSelectedLevel(level);
    let newClass = 'levelsBtn';
    if (level === 'beginner' || level === 'intermediate' || level === 'advanced') {
      newClass += ' newPosition';
    }
    setLevelBtnClass(newClass);

    setExerciseGenerated(false); // task with input field no longer visible
    setBlanks(''); // reset the input field to 0
    setShowSnippet(false); // task snippet no longer visible
    setTaskAccepted(false); // accept btn is visible
    resetTimer(); // timer is set to 0
    setTimerVisible(false);
    setCountdownVisible(false);
    setOpacity(0);
    setSubmitClicked(false);
    setUserAnswer(false);
  }

  useEffect(() => {
    const level = searchParams.get('level') || 'beginner';
    handleLevelChange(level);
  }, []);

  return (
    <div className={levelBtnClass}>
      <h3>Select Level</h3>
      <div className="levelButtons">
        <button
          onClick={() => handleLevelChange('beginner')}
          style={
            selectedLevel === 'beginner' ? levelBtnStyle : { backgroundColor: defaultBgColor }
          }>
          Beginner
        </button>
        <button
          onClick={() => handleLevelChange('intermediate')}
          style={
            selectedLevel === 'intermediate' ? levelBtnStyle : { backgroundColor: defaultBgColor }
          }>
          Intermediate
        </button>
        <button
          onClick={() => handleLevelChange('advanced')}
          style={
            selectedLevel === 'advanced' ? levelBtnStyle : { backgroundColor: defaultBgColor }
          }>
          Advanced
        </button>
      </div>
    </div>
  );
}

export default LevelSelector;
