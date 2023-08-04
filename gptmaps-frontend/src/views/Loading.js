import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {

    return <div style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',   
        justifyContent: 'center'
    }}>
        <CircularProgress />
    </div>

}
export default Loading