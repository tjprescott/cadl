//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------------------------

namespace Microsoft.Confluent.Service.Models
{
    /// <summary>
    /// Status of the resource operation.
    /// </summary>
    public struct ProvisioningState
    {
        public static readonly ProvisioningState Completed = "Completed", ResolvingDNS = "ResolvingDNS", Moving = "Moving", Deleting = "Deleting", Succeeded = "Succeeded", Failed = "Failed";

        public string _value;
    }
}