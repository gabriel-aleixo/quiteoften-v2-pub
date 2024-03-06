import React from 'react';

import { withDiscussionItems } from './withDiscussionItems';
import { withActionItems } from './withActionItems';
import GenericBox from './GenericBox';


const Past = ({selectedPair, loading, error}) => {

    if (loading) return <h1>Loading...</h1>
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>
    if (!selectedPair) return <h1>Placeholder text when pair is not selected</h1>;

    
    const DiscussionBox = withDiscussionItems(selectedPair, GenericBox);
    const ActionBox = withActionItems(selectedPair, GenericBox);

    return (
        <div className="columns">
            <div className="column is-three-fifths" id="past-left" >
                <div className="tile is-ancestor">
                    <div className="tile is-vertical">
                        <div className="tile is-parent">
                            <div className="tile is-child box">
                                <p className='title is-5'>Timeline Inputs & Filters</p>
                            </div>
                        </div>
                        <div className="tile is-parent">
                            <div className="tile is-child box">
                                <p className='title is-5'>Timeline</p>
                                <DiscussionBox showAddItemOption={false}
                                    showDeleteItemOption={true}
                                    showToggleCompletionOfItem={true} 
                                    filterByStatus = "COMPLETE_ONLY"/>
                                <ActionBox showAddItemOption={false}
                                    showDeleteItemOption={true}
                                    showToggleCompletionOfItem={true} 
                                    filterByStatus = "COMPLETE_ONLY"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="column" id="past-right">
            <div className="tile is-ancestor">
                    <div className="tile is-parent">
                        <div className="tile is-child box">
                            <p className='title is-5'>Person Card</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Past;