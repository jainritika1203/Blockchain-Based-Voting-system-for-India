pragma solidity ^0.4.24;

contract voting{

	mapping(bytes32 => uint8) public votesReceived;
	bytes32[] public candidateList;

	function voting(bytes32[] candidateName)
	{
		candidateList=candidateName;
	}

	function totalvotesfor(bytes32 candidate) view public returns(uint8)
	{
		require(validCandidate(candidate));
		return votesReceived[candidate];
	}
		
	function voteforcandidate(bytes32 candidate) public
	{
		require(validCandidate(candidate));
		votesReceived[candidate]+=1;
	}

	function validCandidate(bytes32 candidate) view public returns (bool) 
	{
	
		for(uint i = 0; i < candidateList.length; i++)
		{

			if (candidateList[i] == candidate)
			{

				return true;

			}			
	
		}	
		
			return false;

	}
	function getCandidateList() view public returns(bytes32[])
	{
		return candidateList;
	}
	function getWinner() view public returns(bytes32)
	{
		 uint8 max=0;
	    for(uint8 i=0;i<candidateList.length;i++)
	    {
	        if(votesReceived[candidateList[i]]>max)
	        {
	           max=i;
	        }
	    }
		return candidateList[max];
    }
}