import { FaTrash, FaSortDown, FaSortUp } from 'react-icons/fa'
import { useState, Fragment } from 'react';
import AddItem from './AddItem'



const ItemRow = ({ item, showDeleteItemOption,
    showToggleCompletionOfItem, onDeleteItem,
    onSwapItemsPositionInPair, toggleCompletionOfItem, 
    itemIdToSwapWithOnMoveUp, itemIdToSwapWithOnMoveDown }) => {
    const [checked, setChecked] = useState(item.complete);
    const handleChange = () => {
        toggleCompletionOfItem(item.id);
        setChecked(!checked);
    }
    const ConditionalWrapper = ({ condition, wrapper, children }) =>
        condition ? wrapper(children) : children;

    return (
        <tr>
            <td key={item.id}>
                <ConditionalWrapper
                    condition={showToggleCompletionOfItem}
                    wrapper={children =>
                        <label className="checkbox">
                            <input type="checkbox"
                                onChange={handleChange}
                                checked={checked}
                            />
                            {children}
                        </label>
                    }
                >
                    <Fragment>
                        {item.description}
                    </Fragment>
                </ConditionalWrapper>
            </td>
            <td>
                {itemIdToSwapWithOnMoveUp &&
                    <FaSortUp
                        style={{ cursor: 'pointer' }}
                        onClick={() => onSwapItemsPositionInPair(item.id, itemIdToSwapWithOnMoveUp)} 
                    />
                }
            </td>
            <td>
                {itemIdToSwapWithOnMoveDown &&
                    <FaSortDown
                        style={{ cursor: 'pointer' }}
                        onClick={() => onSwapItemsPositionInPair(item.id, itemIdToSwapWithOnMoveDown)}
                    />
                }
            </td>
            <td>
                {showDeleteItemOption &&
                    <FaTrash
                        style={{ cursor: 'pointer' }}
                        onClick={() => onDeleteItem(item.id)}
                    />
                }
            </td>
        </tr>
    )
}


const GenericBox = ({
    filterByStatus, showAddItemOption, showDeleteItemOption,
    showToggleCompletionOfItem, onAdd, onDelete, onSwapItemsPositionInPair, toggleCompletion, items, itemType
}) => {


    const [showAddItemForm, setShowAddItemForm] = useState(false);
    let filteredItems = null;
    if (items != null && items.length > 0) {
        if (`INCOMPLETE_ONLY`===filterByStatus) {
            filteredItems = items.filter(item => item.complete === false);
        }
        else if (`COMPLETE_ONLY`===filterByStatus) {
            filteredItems = items.filter(item => item.complete === true);
        }
        else {
            filteredItems = items;
        }
        
    }


    return (
        <>
            <p className="title is-5">For {itemType}</p>
            {showAddItemOption &&
                <div className="level">
                    <div className="level-left"></div>
                    <div className="level-right">
                        <div className="level-item">
                            <div className="field" >
                                <div className="control">
                                    <button className="button is-primary"
                                        onClick={() => setShowAddItemForm(!showAddItemForm)}
                                    >
                                        add item
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            }
            {showAddItemForm && <AddItem onAdd={onAdd} itemType={itemType} />}
            <div className="block">
                <table className="table is-fullwidth">
                    <tbody>
                        <>
                            {filteredItems != null && filteredItems.length > 0 && filteredItems.map((item, index) => (
                                <ItemRow
                                    key={item.id}
                                    item={item}
                                    showDeleteItemOption={showDeleteItemOption}
                                    showToggleCompletionOfItem={showToggleCompletionOfItem}
                                    onDeleteItem={onDelete}
                                    onSwapItemsPositionInPair={onSwapItemsPositionInPair}
                                    toggleCompletionOfItem={toggleCompletion}
                                    itemIdToSwapWithOnMoveUp={(index > 0)?(filteredItems[index-1].id):null } 
                                    itemIdToSwapWithOnMoveDown={(index < (filteredItems.length -1) )?(filteredItems[index+1].id):null }/>
                            ))}
                        </>

                    </tbody>
                </table>
            </div>
        </>
    )
}

export default GenericBox