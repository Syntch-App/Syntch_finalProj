import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import CircularProgressWithLabel from 'common/components/CircularProgressWithLabel';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as uuid from 'uuid';

import { useContext, useEffect, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { GameContext } from 'gameSection/Context/GameContext';
import AuthContext from 'auth/contexts/AuthProvider';

function Dashboard() {
  const {
    setData,
    beginnerLength,
    setBeginnerLength,
    intermediateLength,
    setIntermediateLength,
    advancedLength,
    setAdvancedLength,
    beginnerCount,
    setBeginnerCount,
    intermediateCount,
    setIntermediateCount,
    advancedCount,
    setAdvancedCount,
    beginnerPoints,
    setBeginnerPoints,
    intermediatePoints,
    setIntermediatePoints,
    advancedPoints,
    setAdvancedPoints,
    setUserStatistics,
    userStatistics
  } = useContext(GameContext);
  const { authUser } = useContext(AuthContext);
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/task/all`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authUser.accessToken}`
          }
        });
        const data = await response.json();
        setData(data);
        console.log('DATA:', data);
        const beginnerObjects = data.filter((obj) => obj.level.name === 'beginner');
        const intermediateObjects = data.filter((obj) => obj.level.name === 'intermediate');
        const advancedObjects = data.filter((obj) => obj.level.name === 'advanced');
        setBeginnerLength(beginnerObjects.length);
        setIntermediateLength(intermediateObjects.length);
        setAdvancedLength(advancedObjects.length);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const getCountByLevel = (statistics, level) => {
    // eslint-disable-next-line no-underscore-dangle
    const levelData = statistics.find((item) => item._id === level);
    return levelData ? levelData.count : 0;
  };

  const getTotalPointsByLevel = (statistics, level) => {
    // eslint-disable-next-line no-underscore-dangle
    const levelData = statistics.find((item) => item._id === level);
    return levelData ? levelData.totalPoints : 0;
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/activity/statistics`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authUser.accessToken}`,
            user: authUser.uid
          }
        });
        const data = await response.json();
        const { statistics } = data;
        setUserStatistics(statistics || []);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, [authUser.accessToken]);

  useEffect(() => {
    // Statistics data for each level
    const beginnerArrCount = getCountByLevel(userStatistics, 'beginner');
    setBeginnerCount(beginnerArrCount);
    const intermediateArrCount = getCountByLevel(userStatistics, 'intermediate');
    setIntermediateCount(intermediateArrCount);
    const advancedArrCount = getCountByLevel(userStatistics, 'advanced');
    setAdvancedCount(advancedArrCount);
    const beginnerTotalPoints = getTotalPointsByLevel(userStatistics, 'beginner');
    setBeginnerPoints(beginnerTotalPoints);
    const intermediateTotalPoints = getTotalPointsByLevel(userStatistics, 'intermediate');
    setIntermediatePoints(intermediateTotalPoints);
    const advancedTotalPoints = getTotalPointsByLevel(userStatistics, 'advanced');
    setAdvancedPoints(advancedTotalPoints);

    // console.log('Beginner Count:', beginnerArrCount);
    // console.log('Intermediate Count:', intermediateArrCount);
    // console.log('Advanced Count:', advancedArrCount);

    // console.log('Beginner Total Points:', beginnerTotalPoints);
    // console.log('Intermediate Total Points:', intermediateTotalPoints);
    // console.log('Advanced Total Points:', advancedTotalPoints);
  }, [userStatistics]);

  console.log('Statistics:', userStatistics);

  const getLevels = () => {
    return [
      {
        title: 'Beginner',
        totalTasks: beginnerLength,
        finishedTasks: beginnerCount,
        currentScore: beginnerPoints,
        maxScore: 300,
        level: 'beginner'
      },
      {
        title: 'Intermediate',
        totalTasks: intermediateLength,
        finishedTasks: intermediateCount,
        currentScore: intermediatePoints,
        maxScore: 500,
        level: 'intermediate'
      },
      {
        title: 'Advanced',
        totalTasks: advancedLength,
        finishedTasks: advancedCount,
        currentScore: advancedPoints,
        maxScore: 800,
        level: 'advanced'
      }
    ];
  };

  useEffect(() => {
    const l = getLevels();
    setLevels(l);
  }, [userStatistics]);

  const play = (level) => {
    navigate({
      pathname: '/tasksection',
      search: createSearchParams({
        level
      }).toString()
    });
  };

  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      {levels.map((level) => {
        return (
          <Card
            key={uuid.v4()}
            sx={{ m: 2, border: 1, borderColor: 'primary.main' }}
            align="center">
            <CardActionArea>
              <CardHeader
                title={level.title}
                titleTypographyProps={{ color: 'secondary', fontWeight: 'bold' }}
              />
              {/* <CardContent>
                <Typography variant="h6">Lorem ipsum dolor sit amet.</Typography>
              </CardContent> */}
              <CardContent>
                <TableContainer>
                  <Table
                    sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: 'none' } }}
                    size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">
                          <Typography variant="h6">FINISHED</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6">SCORE</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell align="center">
                          {level.finishedTasks} of {level.totalTasks}
                        </TableCell>
                        <TableCell align="center">
                          {level.currentScore} of {level.maxScore}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="center">
                          <CircularProgressWithLabel
                            value={(level.finishedTasks / level.totalTasks) * 100}
                            variant="determinate"
                            color="secondary"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <CircularProgressWithLabel
                            value={(level.currentScore / level.maxScore) * 100}
                            variant="determinate"
                            color="secondary"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </CardActionArea>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button variant="contained" onClick={() => play(level.level)}>
                PLAY
              </Button>
              {/* {level.finishedTasks === 0 ? (
                <Button variant="contained">Play</Button>
              ) : level.finishedTasks === level.totalTasks ? (
                <Button variant="contained">Replay</Button>
              ) : (
                <>
                  <Button variant="contained">Resume</Button>
                  <Button variant="contained">Reset</Button>
                </>
              )} */}
            </CardActions>
          </Card>
        );
      })}
    </Box>
  );
}

export default Dashboard;
