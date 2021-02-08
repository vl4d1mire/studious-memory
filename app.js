import {upload} from './update'

upload('#file', {
    multi: true,
    accept: ['.jpeg', '.jpg', '.png', '.gif']
})