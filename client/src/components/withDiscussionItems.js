import React, { useState, useEffect } from 'react';
import { postData, deleteData, putData } from '../helpers.js';
import useSWR from "swr";

export const withDiscussionItems = (selectedPair, Component) => {
	return props => {

		const [discussionItems, setDiscussionItems] = useState(null);

		const {data, error} = useSWR(`/api/discussion-items/${selectedPair.id}`, {refreshInterval: 10000}); //refresh every 10 seconds, while user is in focus

		if (error) {
			console.error(error);
			return null;
		}

		useEffect(() => {
			if (data){
				setDiscussionItems (data);
			}
		}, [data]);

		const addDiscussionItem = async (discussionItem) => {

			const complete = false;
			const newDiscussionItem = { complete, ...discussionItem };
			const result = await postData(`/api/discussion-items/${selectedPair.id}`, {}, newDiscussionItem);
			setDiscussionItems([...discussionItems, result]);
		  }
		
		// Delete Discussion Item
		const deleteDiscussionItem = async (id) => {
			const res = await deleteData(`/api/discussion-items/${id}`);
			//We should control the response status to decide if we will change the state or not.
			res.status === 200
				? setDiscussionItems(discussionItems.filter((discussionItem) => discussionItem.id !== id))
				: alert('Error Deleting This Discussion Item');
		}
		
		// Toggle completion of Discussion Item
		const toggleCompletionOfDiscussionItem = async (id) => {

			let discussionItemToToggleCompletion = discussionItems.find(o => o.id === id);
		
			const updatedDiscussionItem = {
				...discussionItemToToggleCompletion,
				complete: !discussionItemToToggleCompletion.complete
			}
			const res = await putData(`/api/discussion-items/${id}`, {}, updatedDiscussionItem);
				
			setDiscussionItems(
				discussionItems.map((discussionItem) =>
				discussionItem.id === id ? {...discussionItem, complete: res.complete} : discussionItem
				));

		}

		// Swap positions in pair of the 2 passed in action items
		const swapDiscussionItemsPositionInPair = async (srcItemId, dstItemId) => {
			const params = {};
			params.srcItemId = srcItemId;
			params.dstItemId = dstItemId;
			const res = await postData(`/api/discussion-items/swapPositionsInPair`, params);
			
			setDiscussionItems(
				discussionItems.map((discussionItem) => {

					switch (discussionItem.id) {
						case srcItemId:						
						  return res.find(discussionItemAfterUpdate=>discussionItemAfterUpdate.id === dstItemId);
						case dstItemId:
						  return res.find(discussionItemAfterUpdate=>discussionItemAfterUpdate.id === srcItemId); 
						default:
						  return discussionItem;
					  }			  
				 }
				));
		}

		return (discussionItems && 
			<Component {...props}
			itemType = "discussion"
		  	items = {discussionItems}
			onAdd={addDiscussionItem}
			onDelete={deleteDiscussionItem}
			onSwapItemsPositionInPair={swapDiscussionItemsPositionInPair}
			toggleCompletion={toggleCompletionOfDiscussionItem} />)
	}
}