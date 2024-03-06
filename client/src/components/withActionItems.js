import React, { useState, useEffect } from 'react';
import { postData, deleteData, putData } from '../helpers.js';
import useSWR from "swr";

export const withActionItems = (selectedPair, Component) => {
	return props => {

		const [actionItems, setActionItems] = useState(null);

		const {data, error} = useSWR(`/api/action-items/${selectedPair.id}`, {refreshInterval: 10000}); //refresh every 10 seconds, while user is in focus
	
		if (error) {
			console.error(error);
			return null;
		}

		useEffect(() => {
			if (data){
				setActionItems (data);
			}
		}, [data]);


					
		const addActionItem = async (actionItem) => {
			const complete = false;
			const newActionItem = { complete, ...actionItem };
			const result = await postData(`/api/action-items/${selectedPair.id}`, {}, newActionItem);
			setActionItems([...actionItems, result]);
		  }
		
		// Delete Action Item
		const deleteActionItem = async (id) => {
			const res = await deleteData(`/api/action-items/${id}`);
			//We should control the response status to decide if we will change the state or not.
			res.status === 200
				? setActionItems(actionItems.filter((actionItem) => actionItem.id !== id))
				: alert('Error Deleting This Action Item');
		}
		
		// Toggle completion of Action Item
		const toggleCompletionOfActionItem = async (id) => {

			let actionItemToToggleCompletion = actionItems.find(o => o.id === id);
		
			const updatedActionItem = {
				...actionItemToToggleCompletion,
				complete: !actionItemToToggleCompletion.complete
			}
			const res = await putData(`/api/action-items/${id}`, {}, updatedActionItem);
			
			setActionItems(
				actionItems.map((actionItem) =>
				  actionItem.id === id ? {...actionItem, complete: res.complete} : actionItem
				));

		}

		// Swap positions in pair of the 2 passed in action items
		const swapActionItemsPositionInPair = async (srcItemId, dstItemId) => {
			const params = {};
			params.srcItemId = srcItemId;
			params.dstItemId = dstItemId;
			const res = await postData(`/api/action-items/swapPositionsInPair`, params);
			
			setActionItems(
				actionItems.map((actionItem) => {

					switch (actionItem.id) {
						case srcItemId:						
						  return res.find(actionItemAfterUpdate=>actionItemAfterUpdate.id === dstItemId);
						case dstItemId:
						  return res.find(actionItemAfterUpdate=>actionItemAfterUpdate.id === srcItemId); 
						default:
						  return actionItem;
					  }			  
				 }
				));
		}

		return (actionItems && 
			<Component {...props}
			itemType = "action"
		  	items = {actionItems}
			onAdd={addActionItem}
			onDelete={deleteActionItem}
			onSwapItemsPositionInPair={swapActionItemsPositionInPair}
			toggleCompletion={toggleCompletionOfActionItem} />)
	}
}