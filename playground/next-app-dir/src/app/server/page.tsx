import { createStyle, mergeStyle } from '@kaze-style/react';
import { Button } from '@/components/Button';

const classes = createStyle({
  title: {
    fontSize: '2rem',
    color: 'green',
    marginBottom: '1.5rem',
  },
  buttonContainer: {
    display: 'flex',
    gap: '5px',
  },
  button: {
    padding: ['10px', '20px'],
  },
  blueButton: {
    background: 'blue',
    ':hover': {
      background: 'skyblue',
    },
  },
});

const Server = () => {
  return (
    <div>
      <h1 className={classes.title}>Server Component</h1>
      <div className={classes.buttonContainer}>
        <Button className={classes.button}>Button</Button>
        <Button className={mergeStyle(classes.button, classes.blueButton)}>
          Button
        </Button>
        <Button className={classes.button}>Button</Button>
      </div>
    </div>
  );
};

export default Server;
